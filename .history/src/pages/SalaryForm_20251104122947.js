import React, { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

export default function SalaryManager() {
  const [form, setForm] = useState({
    salaryId: "",
    memberId: "",
    salaryType: "MEMBER",
    positionSalaryId: "",
    baseSalary: "",
    hourlyRate: "",
    salaryMonth: "",
    payDate: "",
    grossPay: "",
    totalDeduction: "",
    netPay: "",
    status: "PENDING",
  });

  const [members, setMembers] = useState([]);
  const [positionSalaries, setPositionSalaries] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [m, p, s] = await Promise.all([
      axios.get("/api/members"),
      axios.get("/api/position-salaries"),
      axios.get("/api/salaries"),
    ]);
    setMembers(m.data);
    setPositionSalaries(p.data);
    setList(s.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.salaryId) {
      await axios.put(`/api/salaries/${form.salaryId}`, form);
      alert("수정 완료!");
    } else {
      await axios.post("/api/salaries", form);
      alert("등록 완료!");
    }
    setForm({
      salaryId: "",
      memberId: "",
      salaryType: "MEMBER",
      positionSalaryId: "",
      baseSalary: "",
      hourlyRate: "",
      salaryMonth: "",
      payDate: "",
      grossPay: "",
      totalDeduction: "",
      netPay: "",
      status: "PENDING",
    });
    fetchData();
  };

  const handleEdit = (item) => {
    setForm({
      ...item,
      salaryId: item.salaryId,
      memberId: item.memberId,
      salaryType: item.salaryType,
      positionSalaryId: item.salaryType === "POSITION" ? item.positionSalaryId : "",
      baseSalary: item.baseSalary || "",
      hourlyRate: item.hourlyRate || "",
      salaryMonth: item.salaryMonth,
      payDate: item.payDate,
      grossPay: item.grossPay,
      totalDeduction: item.totalDeduction,
      netPay: item.netPay,
      status: item.status,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      await axios.delete(`/api/salaries/${id}`);
      fetchData();
    }
  };

  return (
    <div className="container mt-4">
      <h3>💰 급여 관리</h3>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>회원</Form.Label>
              <Form.Select name="memberId" value={form.memberId} onChange={handleChange}>
                <option value="">선택</option>
                {members.map((m) => (
                  <option key={m.memberId} value={m.memberId}>
                    {m.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>급여 유형</Form.Label>
              <Form.Select name="salaryType" value={form.salaryType} onChange={handleChange}>
                <option value="MEMBER">개인 입력</option>
                <option value="POSITION">직급 선택</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {form.salaryType === "POSITION" ? (
          <Form.Group className="mt-2">
            <Form.Label>직급 급여 선택</Form.Label>
            <Form.Select name="positionSalaryId" value={form.positionSalaryId} onChange={handleChange}>
              <option value="">선택</option>
              {positionSalaries.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.baseSalary}원)
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        ) : (
          <>
            <Row className="mt-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>기본급</Form.Label>
                  <Form.Control
                    type="number"
                    name="baseSalary"
                    value={form.baseSalary}
                    onChange={handleChange}
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
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        <Button type="submit" className="mt-3">
          {form.salaryId ? "수정" : "등록"}
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>회원명</th>
            <th>유형</th>
            <th>급여명</th>
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
              <td>{s.salaryTitle}</td>
              <td>{s.baseSalary}</td>
              <td>{s.hourlyRate}</td>
              <td>{s.netPay}</td>
              <td>{s.status}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(s)}>
                  수정
                </Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(s.salaryId)}>
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}