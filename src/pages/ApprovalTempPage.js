import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../config/config";
import api from "../api/api";
import { formatInTimeZone } from "date-fns-tz";


export default function ApprovalTempPage() {
  const [temps, setTemps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [approvers, setApprovers] = useState([]);

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

  useEffect(() => {
    fetchTemps();
    fetchApprovers();
  }, []);

  const fetchTemps = async () => {
    try {
      const res = await api.get("/api/requests/temp");
      setTemps(res.data);
    } catch (err) {
      console.error("임시보관함 조회 실패:", err);
    }
  };

  const fetchApprovers = async () => {
    try {
      const res = await api.get("/api/requests/approvers");
      setApprovers(res.data);
    } catch (err) {
      console.error("결재자 목록 조회 실패:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (typeof dateString === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateString))
      return dateString;
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  const applyFilters = (data) => {
    const hasFilter = Object.values(appliedFilters).some((v) => v);
    if (!hasFilter) return data;

    return data.filter((r) => {
      const matchWriter =
        appliedFilters.writer && r.memberName?.includes(appliedFilters.writer);
      const matchApprover =
        appliedFilters.approver && r.approverName?.includes(appliedFilters.approver);
      const matchType =
        appliedFilters.type &&
        ((appliedFilters.type === "휴가" &&
          ["연차", "반차", "병가", "공가", "기타"].includes(r.requestType)) ||
          r.requestType === appliedFilters.type);
      const matchStart =
        appliedFilters.startDate &&
        new Date(r.dateTime) >= new Date(appliedFilters.startDate);
      const matchEnd =
        appliedFilters.endDate &&
        new Date(r.dateTime) <= new Date(appliedFilters.endDate);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleApproverChange = (e) => {
    const selectedId = e.target.value;
    const selectedApprover = approvers.find((a) => a.memberId === selectedId);
    setForm((prev) => ({
      ...prev,
      approverId: selectedApprover?.memberId || "",
      approverName: selectedApprover?.name || "",
    }));
  };

  const handleEdit = (item) => {
    const rt =
      item.requestType === "휴가"
        ? `휴가-${item.vacationType || "연차"}`
        : item.requestType;

    setForm({
      ...item,
      requestType: rt,
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
    });
    setShowModal(true);
  };

const handleSave = async () => {
  try {
    // 문서/휴가 타입 분리
    const [mainType, subType] = (form.requestType || "").split("-");

    // 반차/일반 날짜 보정
    let adjustedStartDate = null;
    let adjustedEndDate = null;

    if (mainType === "휴가" && subType === "오전반차") {
      adjustedStartDate = formatInTimeZone(form.startDate, "Asia/Seoul", "yyyy-MM-dd 09:00:00");
      adjustedEndDate   = formatInTimeZone(form.startDate, "Asia/Seoul", "yyyy-MM-dd 13:00:00");
    } else if (mainType === "휴가" && subType === "오후반차") {
      adjustedStartDate = formatInTimeZone(form.startDate, "Asia/Seoul", "yyyy-MM-dd 14:00:00");
      adjustedEndDate   = formatInTimeZone(form.startDate, "Asia/Seoul", "yyyy-MM-dd 18:00:00");
    } else {
      adjustedStartDate = form.startDate
        ? formatInTimeZone(form.startDate, "Asia/Seoul", "yyyy-MM-dd 00:00:00")
        : null;
      adjustedEndDate = form.endDate
        ? formatInTimeZone(form.endDate, "Asia/Seoul", "yyyy-MM-dd 23:59:59")
        : null;
    }

    // "yyyy-MM-dd HH:mm:ss" 로 고정 (T 제거)
    const fmt = (s) => (s ? s.slice(0, 19).replace("T", " ") : null);
    const clean = (v) => (v === "" || v === undefined ? null : v);

    // 서버 관리 필드 제거용 헬퍼
    const stripServerFields = ({
      createDate, updateDate, createId, updateId,
      dateTime, approvalDate, /* comment 는 필요시만 보냄 */
      ...rest
    }) => rest;

    // 폼에서 서버필드 제거
    const base = stripServerFields(form);

    // 최종 페이로드(필요한 필드만)
    const payload = {
      id: base.id,
      memberId: base.memberId,          // 서버가 로그인 정보로 덮어써도 무방
      memberName: base.memberName,
      requestType: mainType || "",
      vacationType: mainType === "휴가" ? (subType || "") : "",
      content: base.content || "",
      approverId: base.approverId || "",
      approverName: base.approverName || "",
      price: clean(base.price) !== null ? Number(base.price) : null,
      status: base.status || "임시저장",
      startDate: fmt(adjustedStartDate),
      endDate: fmt(adjustedEndDate),
      // comment는 승인/반려시에만 필요. 수정에서는 보통 제외.
    };

      await axios.put(`${API_BASE_URL}/api/requests/${form.id}`, payload);
      alert("수정이 완료되었습니다");
      setShowModal(false);
      fetchTemps();
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류가 발생했습니다");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/requests/${id}`);
      alert("삭제되었습니다");
      fetchTemps();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다");
    }
  };

  const handleSubmit = async (id) => {
    if (!form.approverId) {
      alert("결재자를 지정하세요!");
      return;
    }
    try {
      await axios.patch(`${API_BASE_URL}/api/requests/${id}/status`, {
        status: "결재요청",
      });
      alert("결재 요청이 완료되었습니다");
      fetchTemps();
    } catch (err) {
      console.error("결재 요청 실패:", err);
    }
  };

  const filteredTemps = applyFilters(temps);
  const paginatedTemps = filteredTemps.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredTemps.length / itemsPerPage);
    if (totalPages <= 1) return null;
    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">총 {filteredTemps.length}건</div>
        <Pagination>
          <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
          <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
          {Array.from({ length: totalPages }).map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={page === idx + 1}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === totalPages} />
          <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
        </Pagination>
      </div>
    );
  };

  return (
    <Container className="py-4">
      <h3>📂 임시보관함</h3>

      <Table hover responsive bordered>
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>작성자</th>
            <th>종류</th>
            <th>결재자</th>
            <th>작성일자</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTemps.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-muted">
                임시저장된 문서가 없습니다.
              </td>
            </tr>
          ) : (
            paginatedTemps.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.memberName || "이름없음"}</td>
                <td>{t.requestType}</td>
                <td>{t.approverName || "-"}</td>
                <td>{new Date(t.dateTime).toLocaleDateString()}</td>
                <td>
                  <Badge bg="secondary">{t.status}</Badge>
                </td>
                <td>
                  <Button size="sm" variant="outline-primary" onClick={() => handleEdit(t)}>
                    수정
                  </Button>{" "}
                  <Button size="sm" variant="outline-success" onClick={() => handleSubmit(t.id)}>
                    결재요청
                  </Button>{" "}
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(t.id)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {renderPagination()}

      {/* 🟡 변경됨: 문서 종류 단일 Select UI */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>임시문서 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "75vh", overflowY: "auto" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>문서 종류</Form.Label>
              <Form.Select
                name="requestType"
                value={form.requestType || ""}
                onChange={handleChange}
              >
                <option value="">문서 종류 선택</option>
                <option value="출장">출장</option>
                <option value="지출품의서">지출품의서</option>
                <optgroup label="휴가">
                  <option value="휴가-연차">연차</option>
                  <option value="휴가-오전반차">오전반차</option>
                  <option value="휴가-오후반차">오후반차</option>
                  <option value="휴가-병가">병가</option>
                  <option value="휴가-공가">공가</option>
                </optgroup>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="content"
                value={form.content || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>결재자 지정</Form.Label>
              <Form.Select
                name="approverId"
                value={form.approverId || ""}
                onChange={handleApproverChange}
              >
                <option value="">결재자를 선택하세요</option>
                {approvers.map((a) => (
                  <option key={a.memberId} value={a.memberId}>
                    {a.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>시작일</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={form.startDate || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>종료일</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={form.endDate || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" onClick={handleSave} className="w-100">
              저장
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
