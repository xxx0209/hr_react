import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table, Modal, Badge } from "react-bootstrap";
import api from "../api/api"; // axios 인스턴스 (withCredentials 포함)

export default function ApprovalRequestPage() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [approvers, setApprovers] = useState([]); // 결재자 목록 상태 추가

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
    approverName: "", // 추가
  });

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // 🔹 로그인 사용자 정보 가져오기
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

  // 결재자 목록 불러오기
  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const res = await api.get("/api/requests/approvers");
        setApprovers(res.data);
      } catch (err) {
        console.error("결재자 목록 불러오기 실패:", err);
      }
    };
    fetchApprovers();
  }, []);

  // 기안 목록 불러오기
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/requests");
      const filtered = res.data.filter((r) => r.status !== "임시저장");
      setRequests(filtered);
    } catch (err) {
      console.error("기안 목록 조회 실패:", err);
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0, 10);
  };

  // 입력 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 새 기안 작성 버튼
  const handleNewRequest = () => {
    setEditMode(false);
    setEditId(null);
    setForm({
      memberId: user?.memberId || "",
      memberName: user?.name || "",
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

  // 기안 등록 및 임시저장
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

  // 폼 초기화
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

  // 수정 모드 진입
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

  // 회수(삭제)
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

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col><h3>📝 기안 작성</h3></Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleNewRequest}>
            새 기안 작성
          </Button>
        </Col>
      </Row>

      {/* 기안 목록 테이블 */}
      <Table hover responsive bordered>
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>작성자</th>
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
              <td colSpan={7} className="text-center text-muted">등록된 기안이 없습니다.</td>
            </tr>
          ) : (
            requests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.memberName || "이름없음"}</td>
                <td>{r.requestType}</td>
                <td>{formatDate(r.startDate)} ~ {formatDate(r.endDate)}</td>
                <td>{r.content}</td>
                <td>
                  <Badge bg={
                    r.status === "임시저장" ? "warning" :
                    r.status === "승인" ? "success" :
                    "secondary"
                  }>
                    {r.status}
                  </Badge>
                </td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(r)}>수정</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(r.id)}>회수</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* 기안 작성/수정 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "기안 수정" : "기안 작성"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleSubmit(e, false)}>
            <Form.Group className="mb-3">
              <Form.Label>작성자 이름</Form.Label>
              <Form.Control
                type="text"
                value={form.memberName}
                disabled
                placeholder="로그인한 사용자 이름"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>신청 종류</Form.Label>
              <Form.Select name="requestType" value={form.requestType} onChange={handleChange} required>
                <option value="">선택하세요</option>
                <option value="연차">연차</option>
                <option value="반차">반차</option>
                <option value="출장">출장</option>
                <option value="지출품의서">지출품의서</option>
              </Form.Select>
            </Form.Group>

            {/* 결재자 선택 필드 추가 */}
            <Form.Group className="mb-3">
              <Form.Label>결재자 지정</Form.Label>
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
                  <option key={a.memberId} value={a.memberId}>
                    {a.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* 지출품의서일 때만 금액 입력란 표시 */}
            {form.requestType === "지출품의서" && (
              <Form.Group className="mb-3">
                <Form.Label>금액</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                />
              </Form.Group>
            )}

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

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" className="w-100">
                {editMode ? "수정 완료" : "결재요청"}
              </Button>
              <Button variant="secondary" className="w-100" onClick={(e) => handleSubmit(e, true)}>
                임시저장
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
