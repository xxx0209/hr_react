import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Modal, Form, Badge } from "react-bootstrap";
import axios from "axios";

export default function ApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [approvals, setApprovals] = useState([]);

  // 작성 모달창
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    memberId: "",
    requestType: "",
    content: "",
    startDate: "",
    endDate: "",
  });

  // 서버에서 데이터 불러오기
  useEffect(() => {
    fetchRequests();
    fetchApprovals();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/api/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApprovals = async () => {
    try {
      const res = await axios.get("/api/approvals/request/1"); // 예시: requestId=1
      setApprovals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 기안 작성 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/requests", form);
      setShowModal(false);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // 결재 승인/반려
  const handleApproval = async (id, status) => {
    try {
      await axios.post("/api/approvals", {
        id,
        status,
        updatedAt: new Date(),
      });
      fetchApprovals();
      alert(`문서가 ${status} 처리되었습니다.`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-3">
        <Col><h3>전자결재 시스템</h3></Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setShowModal(true)}>기안 작성</Button>
        </Col>
      </Row>

      {/* 기안서 목록 */}
      <Row>
        <Col>
          <h5>기안 목록</h5>
          <Table hover responsive bordered>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>작성자</th>
                <th>종류</th>
                <th>기간</th>
                <th>내용</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted">등록된 문서가 없습니다.</td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.memberId}</td>
                    <td>{r.requestType}</td>
                    <td>{r.startDate} ~ {r.endDate}</td>
                    <td>{r.content}</td>
                    <td>
                      <Badge bg={
                        r.status === "승인" ? "success" :
                        r.status === "반려" ? "danger" : "secondary"
                      }>
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* 결재 목록 */}
      <Row className="mt-5">
        <Col>
          <h5>결재 요청</h5>
          <Table hover responsive bordered>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>문서 ID</th>
                <th>결재자</th>
                <th>상태</th>
                <th>코멘트</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {approvals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted">결재 요청이 없습니다.</td>
                </tr>
              ) : (
                approvals.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.requestId}</td>
                    <td>{a.approverId}</td>
                    <td>{a.status}</td>
                    <td>{a.comment || "-"}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-success"
                        className="me-2"
                        onClick={() => handleApproval(a.id, "승인")}
                      >
                        승인
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleApproval(a.id, "반려")}
                      >
                        반려
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* 기안 작성 모달창 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>기안 작성</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>작성자 ID</Form.Label>
              <Form.Control name="memberId" value={form.memberId} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>신청 종류</Form.Label>
              <Form.Control name="requestType" value={form.requestType} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>내용</Form.Label>
              <Form.Control as="textarea" rows={3} name="content" value={form.content} onChange={handleChange} />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>시작일</Form.Label>
                  <Form.Control type="date" name="startDate" value={form.startDate} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>종료일</Form.Label>
                  <Form.Control type="date" name="endDate" value={form.endDate} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary" className="w-100">기안 등록</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
