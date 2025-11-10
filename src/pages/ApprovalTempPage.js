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

  // 페이지네이션
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

  // 날짜 포맷 (하루 밀림 방지)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (typeof dateString === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateString))
      return dateString;
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  // 필터 적용
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
      (
       (appliedFilters.type === "휴가" &&
       ["연차", "반차", "병가", "공가", "기타"].includes(r.requestType))
       || r.requestType === appliedFilters.type
      );


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
    setForm({
      ...item,
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/requests/${form.id}`, form);
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

  // 필터 적용 + 페이지네이션
  const filteredTemps = applyFilters(temps);
  const paginatedTemps = filteredTemps.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // 페이지네이션 렌더링
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
          <Pagination.Next
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          />
          <Pagination.Last
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          />
        </Pagination>
      </div>
    );
  };

  // 2줄 필터 (ApprovalPage와 동일)
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
              <Button size="sm" variant="primary" onClick={handleSearch}>
                🔍 검색
              </Button>
              <Button size="sm" variant="secondary" onClick={handleReset}>
                ↺ 초기화
              </Button>
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
      <h3>📂 임시보관함</h3>

      {renderFilterBar()}

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

      {/* 수정 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>임시문서 수정</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ maxHeight: "75vh", overflowY: "auto" }}>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>종류</Form.Label>
        <Form.Control
          name="requestType"
          value={form.requestType || ""}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>내용</Form.Label>
        <Form.Control
          as="textarea"
          rows={10} // 🔹 기존보다 더 넓게
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

      {form.requestType === "지출품의서" && (
        <Form.Group className="mb-3">
          <Form.Label>금액</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={form.price || ""}
            onChange={handleChange}
          />
        </Form.Group>
      )}

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
