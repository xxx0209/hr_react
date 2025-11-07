import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";

export default function MemberSalaryPage() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [members, setMembers] = useState([]);

  const [form, setForm] = useState({
    id: "",
    memberId: "",
    baseSalary: "",
    hourlyRate: "",
  });

  const formatNumber = (num) => {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, salaryRes] = await Promise.all([
        axios.get("/member/list"),
        axios.get("/api/member-salaries"),
      ]);
      setMembers(membersRes.data);
      setList(salaryRes.data);
    } catch (err) {
      console.error("데이터 로드 실패:", err);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setForm({
      id: "",
      memberId: "",
      baseSalary: "",
      hourlyRate: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMemberChange = (memberId) => {
    setForm({ ...form, memberId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`/api/member-salaries/${form.id}`, form);
        alert("수정 완료!");
      } else {
        await axios.post("/api/member-salaries", form);
        alert("등록 완료!");
      }
      fetchData();
      handleClose();
    } catch (err) {
      console.error(err);
      alert("저장 중 오류 발생");
    }
  };

  const handleEdit = (data) => {
    setForm({
      id: data.id,
      memberId: data.memberId,
      baseSalary: data.baseSalary,
      hourlyRate: data.hourlyRate,
    });
    setShow(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/member-salaries/${id}`);
      alert("삭제 완료!");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류 발생");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">👤 개인 기준 급여 관리</h3>
      <Button variant="primary" onClick={handleShow}>
        + 개인 급여 등록
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>회원명</th>
            <th>기본급</th>
            <th>시급</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.memberName}</td>
              <td>{formatNumber(item.baseSalary)}원</td>
              <td>{formatNumber(item.hourlyRate)}원</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleEdit(item)}
                  className="me-1"
                >
                  수정
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(item.id)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {form.id ? "개인 급여 수정" : "개인 급여 등록"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>회원 선택</Form.Label>
                  <SelectCombo
                    options={members.map((m) => ({
                      label: m.name,
                      value: m.id,
                    }))}
                    value={form.memberId}
                    onChange={handleMemberChange}
                    placeholder="회원 선택"
                    searchable
                    required
                    disabled={!!form.id}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>기본급</Form.Label>
                  <Form.Control
                    type="number"
                    name="baseSalary"
                    value={form.baseSalary}
                    onChange={handleChange}
                    placeholder="기본급 입력"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>시급</Form.Label>
                  <Form.Control
                    type="number"
                    name="hourlyRate"
                    value={form.hourlyRate}
                    onChange={handleChange}
                    placeholder="시급 입력"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              {form.id ? "수정" : "등록"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
