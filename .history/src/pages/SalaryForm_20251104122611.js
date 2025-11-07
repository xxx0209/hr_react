import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

export default function SalaryForm() {
  const [members, setMembers] = useState([]);
  const [memberSalaries, setMemberSalaries] = useState([]);
  const [positionSalaries, setPositionSalaries] = useState([]);
  const [form, setForm] = useState({
    memberId: "",
    salaryType: "MEMBER",
    memberSalaryId: "",
    positionSalaryId: "",
    salaryMonth: "",
    payDate: "",
    hoursBaseSalary: "",
    grossPay: "",
    totalDeduction: "",
    netPay: "",
    status: "PENDING",
  });

  useEffect(() => {
    // axios.get("/api/members").then((res) => setMembers(res.data));
    // axios.get("/api/member-salaries").then((res) => setMemberSalaries(res.data));
    // axios.get("/api/position-salaries").then((res) => setPositionSalaries(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/salaries", form);
    alert("급여가 등록되었습니다!");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group>
            <Form.Label>회원</Form.Label>
            <Form.Select name="memberId" onChange={handleChange}>
              <option value="">선택</option>
              {members.map((m) => (
                <option key={m.memberId} value={m.memberId}>
                  {m.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>급여 유형</Form.Label>
            <Form.Select name="salaryType" value={form.salaryType} onChange={handleChange}>
              <option value="MEMBER">개인(Member)</option>
              <option value="POSITION">직급(Position)</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {form.salaryType === "MEMBER" && (
        <Form.Group>
          <Form.Label>개인 급여</Form.Label>
          <Form.Select name="memberSalaryId" onChange={handleChange}>
            <option value="">선택</option>
            {memberSalaries.map((ms) => (
              <option key={ms.id} value={ms.id}>
                {ms.member.name} - {ms.baseSalary}원
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      {form.salaryType === "POSITION" && (
        <Form.Group>
          <Form.Label>직급 급여</Form.Label>
          <Form.Select name="positionSalaryId" onChange={handleChange}>
            <option value="">선택</option>
            {positionSalaries.map((ps) => (
              <option key={ps.id} value={ps.id}>
                {ps.title} - {ps.baseSalary}원
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      <Button type="submit" className="mt-3" variant="primary">
        급여 등록
      </Button>
    </Form>
  );
}