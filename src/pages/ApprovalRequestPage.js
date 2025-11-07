import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table, Modal, Badge, Pagination } from "react-bootstrap";
import api from "../api/api";

export default function ApprovalRequestPage() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [approvers, setApprovers] = useState([]);
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
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // 필터 상태 추가
  const [filters, setFilters] = useState({
    writer: "",
    approver: "",
    type: "",
    startDate: "",
    endDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [searchMode, setSearchMode] = useState("or");

  // 페이징 관련
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return isNaN(d) ? "" : d.toISOString().slice(0, 10);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 필터 적용 함수
  const applyFilters = (data) => {
    const hasFilter = Object.values(appliedFilters).some((v) => v);
    if (!hasFilter) return data;

    return data.filter((r) => {
      const matchWriter = appliedFilters.writer && r.memberName?.includes(appliedFilters.writer);
      const matchApprover = appliedFilters.approver && r.approverName?.includes(appliedFilters.approver);
      const matchType = appliedFilters.type && r.requestType === appliedFilters.type;
      const matchStart = appliedFilters.startDate && new Date(r.dateTime) >= new Date(appliedFilters.startDate);
      const matchEnd = appliedFilters.endDate && new Date(r.dateTime) <= new Date(appliedFilters.endDate);

      if (searchMode === "and") {
        return (
          (!appliedFilters.writer || matchWriter) &&
          (!appliedFilters.approver || matchApprover) &&
          (!appliedFilters.type || matchType) &&
          (!appliedFilters.startDate || matchStart) &&
          (!appliedFilters.endDate || matchEnd)
        );
      }
      return matchWriter || matchApprover || matchType || matchStart || matchEnd;
    });
  };

  const handleSearch = () => setAppliedFilters(filters);
  const handleReset = () => {
    const empty = { writer: "", approver: "", type: "", startDate: "", endDate: "" };
    setFilters(empty);
    setAppliedFilters(empty);
  };

  // 기안작성 버튼 함수
  const handleNewRequest = () => {
    if (!user) {
      alert("사용자 정보를 불러오는 중입니다. 잠시만 기다려주세요.");
      return;
    }

    setEditMode(false);
    setEditId(null);
    setForm({
      memberId: user.memberId,
      memberName: user.name,
      requestType: "",
      content: "",
      startDate: "",
      endDate: "",
      price: "",
      status: "작성중",
      approverId: "",
      approverName: "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e, isTemp = false) => {
    e.preventDefault();
    try {
      const submitData = {
        ...form,
        status: isTemp ? "임시저장" : "결재요청",
        memberName: user?.name || form.memberName,
      };

      if (!isTemp && !form.approverId) {
        alert("결재자를 선택하세요.");
        return;
      }

      if (editMode) {
        await api.put(`/api/requests/${editId}`, submitData);
        alert(isTemp ? "기안이 임시저장되었습니다" : "결재요청이 완료되었습니다");
      } else {
        await api.post(`/api/requests`, submitData);
        alert(isTemp ? "임시저장되었습니다" : "결재요청이 등록되었습니다");
      }

      setShowModal(false);
      setEditMode(false);
      setEditId(null);
      fetchRequests();
      resetForm();
    } catch (err) {
      console.error("기안 저장 실패:", err);
      alert("기안 저장 중 오류가 발생했습니다");
    }
  };

  const resetForm = () => {
    setForm({
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
    });
  };

  const handleEdit = (r) => {
    setEditMode(true);
    setEditId(r.id);
    setForm({
      memberId: r.memberId || "",
      memberName: r.memberName || user?.name || "",
      requestType: r.requestType,
      content: r.content,
      startDate: r.startDate ? formatDate(r.startDate) : "",
      endDate: r.endDate ? formatDate(r.endDate) : "",
      price: r.price || "",
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

  // 필터 적용 후 페이지네이션
  const filtered = applyFilters(requests);
  const paginatedRequests = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // 페이지네이션 렌더링
  const renderPagination = () => {
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (totalPages <= 1) return null;
    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">총 {filtered.length}건</div>
        <Pagination>
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
      </div>
    );
  };

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col><h3>📝 기안 작성</h3></Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleNewRequest} disabled={!user}>
            새 기안 작성
          </Button>
        </Col>
      </Row>

      {/* 필터 영역 추가 */}
      <Form className="p-2 bg-light rounded mb-3 shadow-sm compact-filter">
        <Row className="g-2 align-items-center mb-1">
          <Col md={3}><Form.Control placeholder="작성자" value={filters.writer} onChange={(e) => setFilters({ ...filters, writer: e.target.value })} /></Col>
          <Col md={3}><Form.Control placeholder="결재자" value={filters.approver} onChange={(e) => setFilters({ ...filters, approver: e.target.value })} /></Col>
          <Col md={3}>
            <Form.Select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="">문서 종류</option>
              <option value="연차">연차</option>
              <option value="반차">반차</option>
              <option value="출장">출장</option>
              <option value="지출품의서">지출품의서</option>
            </Form.Select>
          </Col>
          <Col md={3} className="text-end">
            <div className="d-flex gap-1 justify-content-end">
              <Button size="sm" variant="primary" onClick={handleSearch}>🔍검색</Button>
              <Button size="sm" variant="secondary" onClick={handleReset}>↺초기화</Button>
            </div>
          </Col>
        </Row>
        <Row className="g-2 align-items-center mt-1">
          <Col md={6}>
            <div className="d-flex align-items-center">
              <Form.Control type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
              <span className="mx-2">~</span>
              <Form.Control type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
            </div>
          </Col>
          <Col md={6} className="text-end">
            <Form.Check inline label="통합검색" type="radio" name="mode" checked={searchMode === "and"} onChange={() => setSearchMode("and")} />
            <Form.Check inline label="카테고리검색" type="radio" name="mode" checked={searchMode === "or"} onChange={() => setSearchMode("or")} />
          </Col>
        </Row>
      </Form>

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
            <tr><td colSpan={7} className="text-center text-muted">등록된 기안이 없습니다.</td></tr>
          ) : (
            paginatedRequests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.memberName || "이름없음"}</td>
                <td>{r.approverName || "-"}</td>
                <td>{r.requestType}</td>
                <td>{new Date(r.dateTime).toLocaleDateString()}</td>
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

      {/* 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>{editMode ? "기안 수정" : "기안 작성"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleSubmit(e, false)}>
            <Form.Group className="mb-3"><Form.Label>작성자</Form.Label><Form.Control type="text" value={form.memberName} disabled /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>신청 종류</Form.Label>
              <Form.Select name="requestType" value={form.requestType} onChange={handleChange} required>
                <option value="">선택하세요</option>
                <option value="연차">연차</option>
                <option value="반차">반차</option>
                <option value="출장">출장</option>
                <option value="지출품의서">지출품의서</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>결재자 지정</Form.Label>
              <Form.Select
                name="approverId"
                value={form.approverId || ""}
                onChange={(e) => {
                  const selected = approvers.find(a => a.memberId === e.target.value);
                  setForm((prev) => ({
                    ...prev,
                    approverId: selected?.memberId || "",
                    approverName: selected?.name || "",
                  }));
                }}
                required
              >
                <option value="">결재자를 선택하세요</option>
                {approvers.map((a) => (
                  <option key={a.memberId} value={a.memberId}>{a.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {form.requestType === "지출품의서" && (
              <Form.Group className="mb-3"><Form.Label>금액</Form.Label><Form.Control type="number" name="price" value={form.price} onChange={handleChange} min="0" /></Form.Group>
            )}

            <Form.Group className="mb-3"><Form.Label>내용</Form.Label><Form.Control as="textarea" rows={3} name="content" value={form.content} onChange={handleChange} required /></Form.Group>

            <Row>
              <Col><Form.Group className="mb-3"><Form.Label>시작일</Form.Label><Form.Control type="date" name="startDate" value={form.startDate} onChange={handleChange} /></Form.Group></Col>
              <Col><Form.Group className="mb-3"><Form.Label>종료일</Form.Label><Form.Control type="date" name="endDate" value={form.endDate} onChange={handleChange} /></Form.Group></Col>
            </Row>

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
