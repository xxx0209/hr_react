// src/pages/ApprovalTempPage.js
import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Badge, Row, Col } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../config/config";
import api from "../api/api"; 

export default function ApprovalTempPage() {
  const [temps, setTemps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchTemps();
  }, []);

const fetchTemps = async () => {
  try {
    const res = await api.get("/api/requests/temp");
    setTemps(res.data);
  } catch (err) {
    console.error("임시보관함 조회 실패:", err);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 수정 버튼 클릭 시
  const handleEdit = (item) => {
    setForm(item);
    setShowModal(true);
  };

  // 수정 저장 요청
  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/requests/${form.id}`, form);
      alert("수정이 완료되었습니다 ");
      setShowModal(false);
      fetchTemps();
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류가 발생했습니다");
    }
  };

  // 삭제 버튼 클릭 시
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

  // 결재요청 버튼 클릭 시
  const handleSubmit = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/requests/${id}/status`, { status: "결재요청" });
      alert("결재 요청이 완료되었습니다");
      fetchTemps();
    } catch (err) {
      console.error("결재 요청 실패:", err);
    }
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
            <th>내용</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {temps.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted">임시저장된 문서가 없습니다.</td>
            </tr>
          ) : (
            temps.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.memberName || t.name || t.member?.name || "이름없음"}</td>
                <td>{t.requestType}</td>
                <td>{t.content}</td>
                <td><Badge bg="secondary">{t.status}</Badge></td>
                <td>
                  <Button size="sm" variant="outline-primary" onClick={() => handleEdit(t)}>수정</Button>{' '}
                  <Button size="sm" variant="outline-success" onClick={() => handleSubmit(t.id)}>결재요청</Button>{' '}
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(t.id)}>삭제</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

{/* 수정 모달 */}
<Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>임시문서 수정</Modal.Title>
  </Modal.Header>
  <Modal.Body>
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
          rows={3}
          name="content"
          value={form.content || ""}
          onChange={handleChange}
        />
      </Form.Group>

      {/* 지출품의서일 때만 금액 입력 표시 */}
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

      <Button variant="primary" onClick={handleSave} className="w-100">
        저장
      </Button>
    </Form>
  </Modal.Body>
</Modal>
    </Container>
  );
}
