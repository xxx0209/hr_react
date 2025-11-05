import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Badge,
  Container,
  Modal,
  Form,
  Tabs,
  Tab,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import api from "../api/api";

export default function ApprovalPage() {
  const [user, setUser] = useState(null);
  const [approvalData, setApprovalData] = useState({
    requests: [],
    processed: [],
    myRequests: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [approvalType, setApprovalType] = useState("");
  const [comment, setComment] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [showDetail, setShowDetail] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // 필터 상태
  const [filters, setFilters] = useState({
    writer: "",
    approver: "",
    type: "",
    startDate: "",
    endDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    writer: "",
    approver: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  //  검색 모드: AND(정확검색) / OR(넓은검색)
  const [searchMode, setSearchMode] = useState("or");

  const [page, setPage] = useState({ requests: 1, processed: 1, myRequests: 1 });
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me");
        setUser(res.data);
      } catch (err) {
        console.error("사용자 정보 불러오기 실패:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) fetchApprovals();
  }, [user]);

  const fetchApprovals = async () => {
    try {
      const res = await api.get("/api/requests/approvals");
      setApprovalData(res.data);
    } catch (err) {
      console.error("결재현황 불러오기 실패:", err);
    }
  };

  const openApprovalModal = (id, type) => {
    setSelectedId(id);
    setApprovalType(type);
    setComment("");
    setShowModal(true);
  };

  const handleApproval = async () => {
    if (!selectedId) return;
    try {
      const url =
        approvalType === "승인"
          ? `/api/requests/${selectedId}/approve`
          : `/api/requests/${selectedId}/reject`;
      await api.patch(url, { comment });
      alert(`${approvalType} 완료`);
      setShowModal(false);
      fetchApprovals();
    } catch (err) {
      alert(`${approvalType} 중 오류 발생`);
    }
  };

  const handleShowDetail = (doc) => {
    setSelectedDoc(doc);
    setShowDetail(true);
  };

  const handleSearch = () => setAppliedFilters(filters);
  const handleReset = () => {
    setFilters({ writer: "", approver: "", type: "", startDate: "", endDate: "" });
    setAppliedFilters({ writer: "", approver: "", type: "", startDate: "", endDate: "" });
  };

  // 필터 적용 
  const applyFilters = (data) => {
    const hasActiveFilter =
      appliedFilters.writer ||
      appliedFilters.approver ||
      appliedFilters.type ||
      appliedFilters.startDate ||
      appliedFilters.endDate;

    if (!hasActiveFilter) return data;

    return data.filter((r) => {
      const matchWriter = appliedFilters.writer && r.memberName?.includes(appliedFilters.writer);
      const matchApprover = appliedFilters.approver && r.approverName?.includes(appliedFilters.approver);
      const matchType = appliedFilters.type && r.requestType === appliedFilters.type;

      const matchStart =
        appliedFilters.startDate && new Date(r.dateTime) >= new Date(appliedFilters.startDate);
      const matchEnd =
        appliedFilters.endDate && new Date(r.dateTime) <= new Date(appliedFilters.endDate);

      if (searchMode === "and") {
        // 정확검색: 모든 조건이 맞아야 함
        return (
          (!appliedFilters.writer || matchWriter) &&
          (!appliedFilters.approver || matchApprover) &&
          (!appliedFilters.type || matchType) &&
          (!appliedFilters.startDate || matchStart) &&
          (!appliedFilters.endDate || matchEnd)
        );
      } else {
        // 넓은검색: 하나라도 맞으면 포함
        return matchWriter || matchApprover || matchType || matchStart || matchEnd;
      }
    });
  };

  const paginate = (data, key) => {
    const startIdx = (page[key] - 1) * itemsPerPage;
    return data.slice(startIdx, startIdx + itemsPerPage);
  };

  const handlePageChange = (key, newPage) => {
    setPage((prev) => ({ ...prev, [key]: newPage }));
    window.scrollTo(0, 0);
  };

  const renderPagination = (data, key) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (totalPages <= 1) return null;
    return (
      <Pagination className="justify-content-center mt-3">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={page[key] === idx + 1}
            onClick={() => handlePageChange(key, idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    );
  };

// 작성일자 하단 배치
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
      {/* 첫 번째 줄: 작성자 / 결재자 / 문서 종류 / 버튼 */}
      <Row className="g-2 align-items-center mb-1">
        <Col md={3}>
          <Form.Label>작성자</Form.Label>
          <Form.Control
            type="text"
            placeholder="작성자 이름"
            value={filters.writer}
            onChange={(e) => setFilters({ ...filters, writer: e.target.value })}
          />
        </Col>

        <Col md={3}>
          <Form.Label>결재자</Form.Label>
          <Form.Control
            type="text"
            placeholder="결재자 이름"
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
            <option value="">전체</option>
            <option value="연차">연차</option>
            <option value="반차">반차</option>
            <option value="출장">출장</option>
            <option value="지출품의서">지출품의서</option>
          </Form.Select>
        </Col>

        <Col md={3} className="text-end">
          <div className="d-flex gap-1 justify-content-end mt-3">
            <Button variant="primary" onClick={handleSearch}>
              🔍 검색
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              ↺ 초기화
            </Button>
          </div>
        </Col>
      </Row>

      {/* 두 번째 줄: 작성일자 + 검색 모드 */}
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
          <div>
            <Form.Check
              inline
              label="통합검색"
              type="radio"
              name="searchMode"
              id="mode-and"
              checked={searchMode === "and"}
              onChange={() => setSearchMode("and")}
            />
            <Form.Check
              inline
              label="카테고리검색"
              type="radio"
              name="searchMode"
              id="mode-or"
              checked={searchMode === "or"}
              onChange={() => setSearchMode("or")}
            />
          </div>
        </Col>
      </Row>
    </Form>
  </>
);

  const renderTable = (data, type) => {
    const filtered = applyFilters(data);
    const paginatedData = paginate(filtered, type);

    return (
      <>
        {renderFilterBar()}
        <Table bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>작성자</th>
              <th>결재자</th>
              <th>종류</th>
              <th>작성일자</th>
              <th>상태</th>
              {type === "requests" && <th>결재</th>}
              {type === "processed" && <th>결재사유</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted">
                  표시할 문서가 없습니다.
                </td>
              </tr>
            ) : (
              paginatedData.map((r) => (
                <tr key={r.id} style={{ cursor: "pointer" }} onClick={() => handleShowDetail(r)}>
                  <td>{r.id}</td>
                  <td>{r.memberName}</td>
                  <td>{r.approverName || "-"}</td>
                  <td>{r.requestType}</td>
                  <td>{new Date(r.dateTime).toLocaleDateString()}</td>
                  <td>
                    <Badge
                      bg={
                        r.status === "승인"
                          ? "success"
                          : r.status === "반려"
                          ? "danger"
                          : r.status === "결재요청"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {r.status}
                    </Badge>
                  </td>
                  {type === "requests" && (
                    <td>
                      <Button
                        size="sm"
                        variant="outline-success"
                        className="me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openApprovalModal(r.id, "승인");
                        }}
                      >
                        승인
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          openApprovalModal(r.id, "반려");
                        }}
                      >
                        반려
                      </Button>
                    </td>
                  )}
                  {type === "processed" && <td>{r.comment || "-"}</td>}
                </tr>
              ))
            )}
          </tbody>
        </Table>
        {renderPagination(filtered, type)}
      </>
    );
  };

  return (
    <Container className="py-4">
      <h3>📊 결재 현황</h3>
      <Tabs defaultActiveKey="requests" className="mt-3">
        <Tab eventKey="requests" title="📬 결재 요청 문서">
          {renderTable(approvalData.requests, "requests")}
        </Tab>
        <Tab eventKey="processed" title="📝 내가 결재한 문서">
          {renderTable(approvalData.processed, "processed")}
        </Tab>
        <Tab eventKey="myRequests" title="📄 내 기안 문서">
          {renderTable(approvalData.myRequests, "myRequests")}
        </Tab>
      </Tabs>

      {/* 상세보기 모달 */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>문서 상세보기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoc ? (
            <>
              <p><strong>작성자:</strong> {selectedDoc.memberName}</p>
              <p><strong>결재자:</strong> {selectedDoc.approverName || "-"}</p>
              <p><strong>종류:</strong> {selectedDoc.requestType}</p>
              <p><strong>내용:</strong></p>
              <p className="border rounded p-2 bg-light">{selectedDoc.content || "내용 없음"}</p>
              <p><strong>작성일자:</strong> {new Date(selectedDoc.dateTime).toLocaleDateString()}</p>
              <p><strong>상태:</strong> {selectedDoc.status}</p>
            </>
          ) : (
            <p>선택된 문서가 없습니다.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* 승인/반려 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{approvalType} 사유 입력</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{approvalType} 사유</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`${approvalType} 사유를 입력하세요`}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            취소
          </Button>
          <Button
            variant={approvalType === "승인" ? "success" : "danger"}
            onClick={handleApproval}
          >
            {approvalType} 완료
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
