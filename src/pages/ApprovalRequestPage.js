import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
  Badge,
  Pagination,
} from "react-bootstrap";
import api from "../api/api";
import { formatInTimeZone } from "date-fns-tz";
import { textTemplates } from "../templates/textTemplates";

export default function ApprovalRequestPage() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [approvers, setApprovers] = useState([]);

  // 기본 폼 상태
  const [form, setForm] = useState({
    memberId: "",
    memberName: "",
    requestType: "",
    content: "",
    startDate: "",
    endDate: "",
    price: "",
    status: "작성중",
    approverId: "",
    approverName: "",
    vacationType: "", // 휴가 종류 추가
  });

  const [showModal, setShowModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // 필터 상태
  const [filters, setFilters] = useState({
    writer: "",
    approver: "",
    type: "",
    startDate: "",
    endDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [searchMode, setSearchMode] = useState("or");

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // 🔸 사용자 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me");
        setUser(res.data);
        setForm((prev) => ({
          ...prev,
          memberId: res.data.memberId,
          memberName: res.data.name,
        }));
      } catch (err) {
        console.error("로그인 사용자 정보 불러오기 실패:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchApprovers();
    fetchRequests();
  }, []);

  const fetchApprovers = async () => {
    try {
      const res = await api.get("/api/requests/approvers");
      setApprovers(res.data);
    } catch (err) {
      console.error("결재자 목록 불러오기 실패:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/requests");
      const filtered = res.data.filter((r) => r.status !== "임시저장");
      setRequests(filtered);
    } catch (err) {
      console.error("기안 목록 조회 실패:", err);
    }
  };

  // 변수 자동 치환 함수
  const fillTemplateVariables = (template, customForm = form) => {
    if (!user) return template;
    const dayCount =
      customForm.startDate && customForm.endDate
        ? Math.ceil(
            (new Date(customForm.endDate) - new Date(customForm.startDate)) /
              (1000 * 60 * 60 * 24)
          ) + 1
        : "";

    return template
      .replaceAll("{작성자명}", user.name || "")
      .replaceAll("{부서명}", user.department || "")
      .replaceAll("{직급}", user.position || "")
      .replaceAll("{작성일}", new Date().toLocaleDateString("ko-KR"))
      .replaceAll("{시작일}", customForm.startDate || "")
      .replaceAll("{종료일}", customForm.endDate || "")
      .replaceAll("{일수}", dayCount)
      .replaceAll("{휴가종류}", customForm.vacationType || "")
      .replaceAll("{금액}", customForm.price || "");
  };

  // 새 기안 작성
  const handleNewRequest = () => {
    if (!user) {
      alert("사용자 정보를 불러오는 중입니다.");
      return;
    }
    setShowTemplateModal(true);
  };

  // 템플릿 선택 시 자동 삽입
  const handleSelectTemplate = (type) => {
    setShowTemplateModal(false);
    setEditMode(false);
    setEditId(null);

    const template = textTemplates[type];
    const replaced = fillTemplateVariables(template, {
      ...form,
      requestType: type,
    });

    setForm({
      memberId: user.memberId,
      memberName: user.name,
      requestType: type,
      content: replaced,
      startDate: "",
      endDate: "",
      price: "",
      status: "작성중",
      approverId: "",
      approverName: "",
      vacationType: "",
    });
    setShowModal(true);
  };

  // 입력 변경 시 자동 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (
        ["startDate", "endDate", "price", "vacationType"].includes(name) &&
        textTemplates[prev.requestType]
      ) {
        updated.content = fillTemplateVariables(
          textTemplates[prev.requestType],
          updated
        );
      }

      return updated;
    });
  };

  // 검색 / 필터 기능 복구
  const applyFilters = (data) => {
    const hasFilter = Object.values(appliedFilters).some((v) => v);
    if (!hasFilter) return data;

    return data.filter((r) => {
      const matchWriter = appliedFilters.writer && r.memberName?.includes(appliedFilters.writer);
      const matchApprover = appliedFilters.approver && r.approverName?.includes(appliedFilters.approver);
      const matchType = appliedFilters.type && r.requestType === appliedFilters.type;

      const matchStart =
        appliedFilters.startDate && new Date(r.dateTime) >= new Date(appliedFilters.startDate);
      const matchEnd =
        appliedFilters.endDate && new Date(r.dateTime) <= new Date(appliedFilters.endDate);

      if (searchMode === "and") {
        return (
          (!appliedFilters.writer || matchWriter) &&
          (!appliedFilters.approver || matchApprover) &&
          (!appliedFilters.type || matchType) &&
          (!appliedFilters.startDate || matchStart) &&
          (!appliedFilters.endDate || matchEnd)
        );
      } else {
        return matchWriter || matchApprover || matchType || matchStart || matchEnd;
      }
    });
  };

  const handleSearch = () => setAppliedFilters(filters);
  const handleReset = () => {
    const empty = { writer: "", approver: "", type: "", startDate: "", endDate: "" };
    setFilters(empty);
    setAppliedFilters(empty);
  };

  const filtered = applyFilters(requests);
  const paginatedRequests = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSubmit = async (e, isTemp = false) => {
    e.preventDefault();
    try {
    let adjustedStartDate = null;
    let adjustedEndDate = null;

    // 반차 유형에 따른 시간대 자동 지정
    if (form.vacationType === "오전반차") {
      // 오전반차: 09:00 ~ 13:00
      adjustedStartDate = formatInTimeZone(form.startDate, "Asia/Seoul", "yyyy-MM-dd 09:00:00");
      adjustedEndDate = formatInTimeZone(form.startDate, "Asia/Seoul", "yyyy-MM-dd 13:00:00");
    } else if (form.vacationType === "오후반차") {
      // 오후반차: 14:00 ~ 18:00
      adjustedStartDate = formatInTimeZone(form.startDate, "Asia/Seoul", "yyyy-MM-dd 14:00:00");
      adjustedEndDate = formatInTimeZone(form.startDate, "Asia/Seoul", "yyyy-MM-dd 18:00:00");
    } else {
      // 일반 휴가 (연차, 병가, 공가 등)
      adjustedStartDate = form.startDate
        ? formatInTimeZone(form.startDate, "Asia/Seoul", "yyyy-MM-dd 00:00:00")
        : null;
      adjustedEndDate = form.endDate
        ? formatInTimeZone(form.endDate, "Asia/Seoul", "yyyy-MM-dd 23:59:59")
        : null;
    }

    const submitData = {
      ...form,
      startDate: adjustedStartDate,
      endDate: adjustedEndDate,
      status: isTemp ? "임시저장" : "결재요청",
      memberName: user?.name || form.memberName,
    };


      if (!isTemp && !form.approverId) {
        alert("결재자를 선택하세요.");
        return;
      }

      if (editMode) {
        await api.put(`/api/requests/${editId}`, submitData);
      } else {
        await api.post(`/api/requests`, submitData);
      }

      alert(isTemp ? "임시저장되었습니다" : "결재요청이 등록되었습니다");
      setShowModal(false);
      fetchRequests();
    } catch (err) {
      console.error("기안 저장 실패:", err);
      alert("기안 저장 중 오류가 발생했습니다");
    }
  };

// 로컬 기준 날짜 변환 (하루 밀림 방지)
const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  // 날짜 문자열이 이미 'YYYY-MM-DD' 형태면 그대로 리턴
  if (typeof dateString === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  // new Date()로 파싱된 경우 로컬 오프셋 보정
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};


const handleEdit = (r) => {
  setEditMode(true);
  setEditId(r.id);
  setForm({
    memberId: r.memberId || "",
    memberName: r.memberName || user?.name || "",
    requestType: r.requestType,
    content: r.content,
    startDate: formatDate(r.startDate),
    endDate: formatDate(r.endDate),
    price: r.price || "",
    vacationType: r.vacationType || "",
    status: r.status,
    approverId: r.approverId || "",
    approverName: r.approverName || "",
  });
  setShowModal(true);
};

  const handleDelete = async (id) => {
    if (!window.confirm("정말 이 기안을 회수하시겠습니까?")) return;
    try {
      await api.delete(`/api/requests/${id}`);
      alert("기안이 회수되었습니다");
      fetchRequests();
    } catch (err) {
      console.error("기안 삭제 실패:", err);
      alert("기안 삭제 중 오류가 발생했습니다");
    }
  };

  // 페이지네이션
  const renderPagination = () => {
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (totalPages <= 1) return null;
    return (
      <Pagination className="justify-content-center mt-3">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={page === idx + 1}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    );
  };

  // 필터 바
    const renderFilterBar = () => (
    <>
      <style>
        {`
          .compact-filter .form-label {
            font-size: 0.85rem;
            margin-bottom: 2px;
          }
          .compact-filter .form-control,
          .compact-filter .form-select {
            height: 32px;
            font-size: 0.85rem;
            padding: 4px 8px;
          }
          .compact-filter .btn {
            font-size: 0.85rem;
            padding: 4px 10px;
          }
          .date-filter input[type="date"] {
            width: 130px;
            font-size: 0.85rem;
          }
          .date-filter span {
            margin: 0 6px;
            font-weight: bold;
          }
        `}
      </style>

      <Form className="p-2 bg-light rounded mb-3 shadow-sm compact-filter">
        <Row className="g-2 align-items-center mb-1">
          <Col md={3}>
          <Form.Label>작성자</Form.Label>
            <Form.Control
              placeholder="작성자"
              value={filters.writer}
              onChange={(e) => setFilters({ ...filters, writer: e.target.value })}
            />
          </Col>
          <Col md={3}>
          <Form.Label>결재자</Form.Label>
            <Form.Control
              placeholder="결재자"
              value={filters.approver}
              onChange={(e) => setFilters({ ...filters, approver: e.target.value })}
            />
          </Col>
          <Col md={3}>
          <Form.Label>문서 종류</Form.Label>
            <Form.Select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">문서 종류</option>
              <option value="휴가">휴가</option>
              <option value="출장">출장</option>
              <option value="지출품의서">지출품의서</option>
            </Form.Select>
          </Col>
          <Col md={3} className="text-end">
            <div className="d-flex gap-1 justify-content-end">
              <Button size="sm" variant="primary" onClick={handleSearch}>🔍 검색</Button>
              <Button size="sm" variant="secondary" onClick={handleReset}>↺ 초기화</Button>
            </div>
          </Col>
        </Row>

        <Row className="g-2 align-items-center mt-1">
          <Col md={6}>
          <Form.Label>작성일자</Form.Label>
            <div className="d-flex align-items-center date-filter">
              <Form.Control
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
              <span>~</span>
              <Form.Control
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </Col>
          <Col md={6} className="text-end">
            <Form.Check
              inline
              label="통합검색"
              type="radio"
              name="mode"
              checked={searchMode === "and"}
              onChange={() => setSearchMode("and")}
            />
            <Form.Check
              inline
              label="카테고리검색"
              type="radio"
              name="mode"
              checked={searchMode === "or"}
              onChange={() => setSearchMode("or")}
            />
          </Col>
        </Row>
      </Form>
    </>
  );

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col><h3>📝 기안 작성</h3></Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleNewRequest} disabled={!user}>새 기안 작성</Button>
        </Col>
      </Row>

      {renderFilterBar()}

      {/* 테이블 */}
      <Table hover responsive bordered>
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>작성자</th>
            <th>결재자</th>
            <th>종류</th>
            <th>작성일자</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRequests.length === 0 ? (
            <tr><td colSpan={6} className="text-center text-muted">등록된 기안이 없습니다.</td></tr>
          ) : (
            paginatedRequests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.memberName}</td>
                <td>{r.approverName || "-"}</td>
                <td>{r.requestType}</td>
                <td>{r.dateTime ? new Date(r.dateTime).toLocaleDateString() : "-"}</td>
                <td><Badge bg={r.status === "승인" ? "success" : "secondary"}>{r.status}</Badge></td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(r)}>수정</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(r.id)}>회수</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {renderPagination()}

      {/* 양식 선택 모달 */}
      <Modal show={showTemplateModal} onHide={() => setShowTemplateModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>양식 선택</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-2">
            <Button variant="outline-primary" onClick={() => handleSelectTemplate("휴가")}>🏖 휴가 신청서</Button>
            <Button variant="outline-success" onClick={() => handleSelectTemplate("출장")}>🚗 출장 신청서</Button>
            <Button variant="outline-warning" onClick={() => handleSelectTemplate("지출품의서")}>💰 지출 품의서</Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* 실제 작성 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton><Modal.Title>{editMode ? "기안 수정" : "기안 작성"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleSubmit(e, false)}>
            <Form.Group className="mb-3"><Form.Label>작성자</Form.Label><Form.Control type="text" value={form.memberName} disabled /></Form.Group>

            <Form.Group className="mb-3"><Form.Label>결재자 지정</Form.Label>
              <Form.Select name="approverId" value={form.approverId || ""} onChange={(e) => {
                const selected = approvers.find(a => a.memberId === e.target.value);
                setForm(prev => ({ ...prev, approverId: selected?.memberId || "", approverName: selected?.name || "" }));
              }} required>
                <option value="">결재자를 선택하세요</option>
                {approvers.map(a => (<option key={a.memberId} value={a.memberId}>{a.name}</option>))}
              </Form.Select>
            </Form.Group>

            {/* 휴가 종류 */}
            {form.requestType === "휴가" && (
              <Form.Group className="mb-3">
                <Form.Label>휴가 종류</Form.Label>
                <Form.Select name="vacationType" value={form.vacationType || ""} onChange={handleChange}>
                  <option value="">선택하세요</option>
                  <option value="연차">연차</option>
                  <option value="오전반차">오전반차</option>
                  <option value="오후반차">오후반차</option>
                  <option value="병가">병가</option>
                  <option value="공가">공가</option>
                </Form.Select>
              </Form.Group>
            )}

            {/* 날짜 */}
            <Row>
              <Col><Form.Group className="mb-3"><Form.Label>시작일</Form.Label><Form.Control type="date" name="startDate" value={form.startDate || ""} onChange={handleChange} /></Form.Group></Col>
              <Col><Form.Group className="mb-3"><Form.Label>종료일</Form.Label><Form.Control type="date" name="endDate" value={form.endDate || ""} onChange={handleChange} /></Form.Group></Col>
            </Row>

            {form.requestType === "지출품의서" && (
              <Form.Group className="mb-3"><Form.Label>금액(원)</Form.Label><Form.Control type="number" name="price" value={form.price || ""} onChange={handleChange} /></Form.Group>
            )}

            {/* 본문 */}
            <Form.Group className="mb-3"><Form.Label>양식 내용</Form.Label>
              <Form.Control as="textarea" rows={18} name="content" value={form.content || ""} onChange={handleChange} />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" className="w-100">{editMode ? "수정 완료" : "결재요청"}</Button>
              <Button variant="secondary" className="w-100" onClick={(e) => handleSubmit(e, true)}>임시저장</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
