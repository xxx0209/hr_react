import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Container, Modal, Form, Tabs, Tab } from "react-bootstrap";
import api from "../api/api";

export default function ApprovalPage() {
  const [user, setUser] = useState(null);
  const [approvalData, setApprovalData] = useState({
    requests: [],
    processed: [],
    myRequests: []
  });
  const [showModal, setShowModal] = useState(false);
  const [approvalType, setApprovalType] = useState("");
  const [comment, setComment] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // 로그인 사용자 정보
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

  // 결재 데이터 불러오기
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

  // 승인/반려 모달
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

  // 테이블 렌더링 함수
  const renderTable = (data, type) => (
    <Table bordered hover responsive>
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>작성자</th>
          <th>종류</th>
          <th>내용</th>
          {type !== "myRequests" && <th>기간</th>}
          <th>상태</th>
          {type === "requests" && <th>결재</th>}
          {type === "processed" && <th>결재사유</th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={type === "requests" ? 7 : 6} className="text-center text-muted">
              표시할 문서가 없습니다.
            </td>
          </tr>
        ) : (
          data.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.memberName}</td>
              <td>{r.requestType}</td>
              <td>{r.content}</td>
              {type !== "myRequests" && (
                <td>{r.startDate?.slice(0, 10)} ~ {r.endDate?.slice(0, 10)}</td>
              )}
              <td>
                <Badge bg={
                  r.status === "승인" ? "success" :
                  r.status === "반려" ? "danger" :
                  r.status === "결재요청" ? "warning" : "secondary"
                }>
                  {r.status}
                </Badge>
              </td>
              {type === "requests" && (
                <td>
                  <Button size="sm" variant="outline-success" className="me-2"
                    onClick={() => openApprovalModal(r.id, "승인")}>승인</Button>
                  <Button size="sm" variant="outline-danger"
                    onClick={() => openApprovalModal(r.id, "반려")}>반려</Button>
                </td>
              )}
              {type === "processed" && <td>{r.comment || "-"}</td>}
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

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

      {/* 승인/반려 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{approvalType} 사유 입력</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
          <Button variant={approvalType === "승인" ? "success" : "danger"} onClick={handleApproval}>
            {approvalType} 완료
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
