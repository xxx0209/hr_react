// src/pages/ApprovalRequestPage.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table, Modal, Badge } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../config/config";

export default function ApprovalRequestPage() {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // 수정 모드 상태
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // 입력 폼 상태
  const [form, setForm] = useState({
    memberId: "",
    requestType: "",
    content: "",
    startDate: "",
    endDate: "",
    status: "작성중",
  });

  // 최초 데이터 불러오기
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/requests`);
      setRequests(res.data);
    } catch (err) {
      console.error("기안 목록 조회 실패:", err);
    }
  };

  // 폼 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 기안 작성/수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${API_BASE_URL}/api/requests/${editId}`, form);
        alert("기안이 수정되었습니다 ");
      } else {
        await axios.post(`${API_BASE_URL}/api/requests`, form);
        alert("기안서가 등록되었습니다 ");
      }

      setShowModal(false);
      setEditMode(false);
      setEditId(null);
      fetchRequests();

      setForm({
        memberId: "",
        requestType: "",
        content: "",
        startDate: "",
        endDate: "",
        status: "작성중",
      });
    } catch (err) {
      console.error("기안 저장 실패:", err);
      alert("기안 저장 중 오류가 발생했습니다");
    }
  };

  // 수정 버튼 클릭 시
  const handleEdit = (r) => {
    setEditMode(true);
    setEditId(r.id);
    setForm({
      memberId: r.member?.id || r.memberId || "",
      requestType: r.requestType,
      content: r.content,
      startDate: r.startDate ? r.startDate.slice(0, 10) : "",
      endDate: r.endDate ? r.endDate.slice(0, 10) : "",
      status: r.status,
    });
    setShowModal(true);
  };

  // 회수(삭제) 버튼 클릭 시
  const handleDelete = async (id) => {
    if (!window.confirm("정말 이 기안을 회수하시겠습니까?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/requests/${id}`);
      alert("기안이 회수되었습니다 ❌");
      fetchRequests();
    } catch (err) {
      console.error("기안 삭제 실패:", err);
      alert("기안 삭제 중 오류가 발생했습니다");
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col><h3>📝 기안 작성</h3></Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => {
              setEditMode(false);
              setShowModal(true);
            }}
          >
            새 기안 작성
          </Button>
        </Col>
      </Row>

      {/* 기안 목록 테이블 */}
      <Table hover responsive bordered>
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>작성자 ID</th>
            <th>종류</th>
            <th>기간</th>
            <th>내용</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-muted">
                등록된 기안이 없습니다.
              </td>
            </tr>
          ) : (
            requests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.member?.id || r.memberId}</td>
                <td>{r.requestType}</td>
                <td>
                  {r.startDate ? r.startDate.slice(0, 10) : "-"} ~{" "}
                  {r.endDate ? r.endDate.slice(0, 10) : "-"}
                </td>
                <td>{r.content}</td>
                <td>
                  <Badge
                    bg={
                      r.status === "승인" ? "success" :
                      r.status === "반려" ? "danger" : "secondary"
                    }
                  >
                    {r.status}
                  </Badge>
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => handleEdit(r)}
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(r.id)}
                  >
                    회수
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* 기안 작성/수정 모달 */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditMode(false);
          setEditId(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "기안 수정" : "기안 작성"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>작성자 ID</Form.Label>
              <Form.Control
                name="memberId"
                value={form.memberId}
                onChange={handleChange}
                required
                disabled={editMode} // 수정 모드에서는 ID 수정 불가
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>신청 종류</Form.Label>
              <Form.Select
                name="requestType"
                value={form.requestType}
                onChange={handleChange}
                required
              >
                <option value="">선택하세요</option>
                <option value="연차">연차</option>
                <option value="반차">반차</option>
                <option value="휴가">휴가</option>
                <option value="출장">출장</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                value={form.content}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>시작일</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={form.startDate}
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
                    value={form.endDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit" className="w-100">
              {editMode ? "수정 완료" : "등록"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
