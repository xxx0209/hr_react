import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col, Nav } from "react-bootstrap";
import axios from "../api/api";

export default function SalaryManager() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [membersSalaries, setMembersSalaries] = useState([]);
  const [positionSalaries, setPositionSalaries] = useState([]);
  const [tab, setTab] = useState("DRAFT"); // DRAFT / COMPLETED
  const [form, setForm] = useState({
    salaryId: "",
    memberId: "",
    salaryType: "MEMBER",
    positionSalaryId: "",
    memberSalaryId: "",
    baseSalary: "",
    hourlyRate: "",
    salaryMonth: "",
    payDate: "",
    grossPay: "",
    totalDeduction: "",
    netPay: "",
    status: "DRAFT",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [m, p] = await Promise.all([
      axios.get("/api/member-salaries"),
      axios.get("/api/position-salaries"),
    ]);
    setMembersSalaries(m.data);
    setPositionSalaries(p.data);
    fetchSalaries(tab);
  };

  const fetchSalaries = async (status) => {
    let url = "/api/salaries";
    if (status === "DRAFT") url += "/drafts";
    else if (status === "COMPLETED") url += "/completed";

    const res = await axios.get(url);
    setList(res.data);
  };

  const handleTabChange = (status) => {
    setTab(status);
    fetchSalaries(status);
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setForm({
      salaryId: "",
      memberId: "",
      salaryType: "MEMBER",
      positionSalaryId: "",
      memberSalaryId: "",
      baseSalary: "",
      hourlyRate: "",
      salaryMonth: "",
      payDate: "",
      grossPay: "",
      totalDeduction: "",
      netPay: "",
      status: "DRAFT",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
      ...(e.target.name === "salaryType" && {
        memberSalaryId: "",
        positionSalaryId: "",
        baseSalary: "",
        hourlyRate: "",
      }),
    });
  };

  const handleMemberSalaryChange = (e) => {
    const id = Number(e.target.value);
    const selected = membersSalaries.find((m) => m.id === id);
    setForm({
      ...form,
      memberSalaryId: id,
      baseSalary: selected ? selected.baseSalary : "",
      hourlyRate: selected ? selected.hourlyRate : "",
    });
  };

  const handlePositionSalaryChange = (e) => {
    const id = Number(e.target.value);
    const selected = positionSalaries.find((p) => p.id === id);
    setForm({
      ...form,
      positionSalaryId: id,
      baseSalary: selected ? selected.baseSalary : "",
      hourlyRate: selected ? selected.hourlyRate : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.salaryId) {
        await axios.put(`/api/salaries/${form.salaryId}`, form);
        alert("급여 수정 완료!");
      } else {
        await axios.post(`/api/salaries`, form);
        alert("급여 등록 완료!");
      }
      fetchSalaries(tab);
      handleClose();
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    }
  };

  const handleEdit = (s) => {
    setForm({
      salaryId: s.salaryId,
      memberId: s.memberId,
      salaryType: s.salaryType,
      positionSalaryId: s.positionSalaryId || "",
      memberSalaryId: s.memberSalaryId || "",
      baseSalary: s.baseSalary || "",
      hourlyRate: s.hourlyRate || "",
      salaryMonth: s.salaryMonth,
      payDate: s.payDate,
      grossPay: s.grossPay,
      totalDeduction: s.totalDeduction,
      netPay: s.netPay,
      status: s.status,
    });
    setShow(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await axios.delete(`/api/salaries/${id}`);
      fetchSalaries(tab);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">💰 급여 관리</h3>

      {/* 탭 버튼 */}
      <div className="mb-3">
        <Button
          variant={tab === "DRAFT" ? "primary" : "outline-primary"}
          className="me-2"
          onClick={() => handleTabChange("DRAFT")}
        >
          승인 전 급여
        </Button>
        <Button
          variant={tab === "COMPLETED" ? "success" : "outline-success"}
          onClick={() => handleTabChange("COMPLETED")}
        >
          승인 완료 급여
        </Button>
      </div>

      <Button variant="primary" onClick={handleShow}>
        + 급여 등록
      </Button>

      {/* 목록 테이블 */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>회원명</th>
            <th>유형</th>
            <th>기본급</th>
            <th>시급</th>
            <th>순급여</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {list.map((s) => (
            <tr key={s.salaryId}>
              <td>{s.salaryId}</td>
              <td>{s.memberName}</td>
              <td>{s.salaryType}</td>
              <td>{s.baseSalary}</td>
              <td>{s.hourlyRate}</td>
              <td>{s.netPay}</td>
              <td>{s.status}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleEdit(s)}
                  className="me-1"
                >
                  수정
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(s.salaryId)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 등록/수정 모달 */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{form.salaryId ? "급여 수정" : "급여 등록"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>급여 유형</Form.Label>
                  <Form.Select
                    name="salaryType"
                    value={form.salaryType}
                    onChange={handleChange}
                  >
                    <option value="MEMBER">개인 입력</option>
                    <option value="POSITION">직급 선택</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                {form.salaryType === "POSITION" ? (
                  <Form.Group>
                    <Form.Label>직급 급여 선택</Form.Label>
                    <Form.Select
                      name="positionSalaryId"
                      value={form.positionSalaryId}
                      onChange={handlePositionSalaryChange}
                    >
                      <option value="">선택</option>
                      {positionSalaries.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.baseSalary}원, 시급 {p.hourlyRate}원)
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                ) : (
                  <Form.Group>
                    <Form.Label>회원 급여 선택</Form.Label>
                    <Form.Select
                      name="memberSalaryId"
                      value={form.memberSalaryId}
                      onChange={handleMemberSalaryChange}
                    >
                      <option value="">선택</option>
                      {membersSalaries.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title} ({m.baseSalary}원, 시급 {m.hourlyRate}원)
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>기본급</Form.Label>
                  <Form.Control
                    type="number"
                    name="baseSalary"
                    value={form.baseSalary}
                    readOnly
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
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>급여월 (YYYY-MM)</Form.Label>
                  <Form.Control
                    type="month"
                    name="salaryMonth"
                    value={form.salaryMonth}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>지급일</Form.Label>
                  <Form.Control
                    type="date"
                    name="payDate"
                    value={form.payDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4 text-end">
              <Button variant="secondary" onClick={handleClose} className="me-2">
                취소
              </Button>
              <Button type="submit" variant="primary">
               
