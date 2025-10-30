import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Container, Row, Col, Modal, Form } from "react-bootstrap";
import api from "../api/api"; // JWT 쿠키 인증 axios 인스턴스

export default function ApprovalPage() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);

  // ✅ 승인/반려 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null); // "approve" | "reject"
  const [comment, setComment] = useState("");

  // 로그인한 사용자 정보 불러오기
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

  // 결재 문서 불러오기
  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/requests");
      setRequests(res.data);
    } catch (err) {
      console.error("문서 목록 불러오기 실패:", err);
    }
  };

  // ✅ 승인/반려 모달 열기
  const openModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setComment("");
    setShowModal(true);
  };

  // ✅ 승인/반려 요청
  const handleAction = async () => {
    if (!selectedRequest) return;
    const id = selectedRequest.id;

    try {
      if (actionType === "approve") {
        await api.patch(`/api/requests/${id}/approve`, { comment });
        alert("✅ 결재 승인 완료");
      } else if (actionType === "reject") {
        await api.patch(`/api/requests/${id}/reject`, { comment });
        alert("❌ 결재 반려 완료");
      }

      setShowModal(false);
      fetchRequests();
    } catch (err) {
      console.error("결재 처리 오류:", err);
      alert("결재 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h3>📋 결재 현황</h3>
        </Col>
      </Row>

      <Table hover responsive bordered>
        <thead className="table-light">
          <tr className="text-center">
            <th>#</th>
            <th>작성자</th>
            <th>종류</th>
            <th>기간</th>
            <th>내용</th>
            <th>상태</th>
            <th>결재자</th>
            <th>결재일</th>
            <th>결재 의견</th>
            {user?.roles?.some((r) => r.authority === "ROLE_ADMIN") && <th>액션</th>}
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center text-muted">
                결재 문서가 없습니다.
              </td>
            </tr>
          ) : (
            requests.map((r, index) => (
              <tr key={r.id} className="text-center align-middle">
                <td>{index + 1}</td>
                <td>{r.memberName || r.memberId}</td>
                <td>{r.requestType}</td>
                <td>
                  {r.startDate?.slice(0, 10)} ~ {r.endDate?.slice(0, 10)}
                </td>
                <td>{r.content}</td>
                <td>
                  <Badge
                    bg={
                      r.status === "승인"
                        ? "success"
                        : r.status === "반려"
                        ? "danger"
                        : r.status === "임시저장"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {r.status}
                  </Badge>
                </td>
                <td>{r.approver || "-"}</td>
                <td>{r.approvalDate ? r.approvalDate.slice(0, 10) : "-"}</td>
                <td>{r.comment || "-"}</td>

                {/* 관리자 전용 버튼 */}
                {user?.roles?.some((r) => r.authority === "ROLE_ADMIN") && (
                  <td>
                    {r.status === "작성중" || r.status === "결재요청" ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline-success"
                          className="me-2"
                          onClick={() => openModal(r, "approve")}
                        >
                          승인
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => openModal(r, "reject")}
                        >
                          반려
                        </Button>
                      </>
                    ) : (
                      <span className="text-muted">처리 완료</span>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* ✅ 승인/반려 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "approve" ? "승인 의견 작성" : "반려 사유 작성"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              {actionType === "approve"
                ? "결재 승인 시 의견 (선택)"
                : "반려 사유 (필수)"}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                actionType === "approve"
                  ? "승인 의견을 입력하세요 (선택사항)"
                  : "반려 사유를 입력하세요"
              }
              required={actionType === "reject"}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            취소
          </Button>
          <Button
            variant={actionType === "approve" ? "success" : "danger"}
            onClick={handleAction}
          >
            {actionType === "approve" ? "승인" : "반려"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
