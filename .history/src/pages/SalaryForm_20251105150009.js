import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "../api/api";

export default function SalaryManager() {
  const [show, setShow] = useState(false);
  const [members, setMembers] = useState([]); // 전체 회원
  const [positionSalaries, setPositionSalaries] = useState([]); // 직급 급여
  const [salaries, setSalaries] = useState([]); // 급여 목록

  const [form, setForm] = useState({
    salaryId: "",
    memberId: null,
    positionId: null,
    salaryType: "MEMBER",
    baseSalary: 0,
    hourlyRate: 0,
    salaryMonth: "",
    payDate: "",
    grossPay: 0,
    netPay: 0,
    status: "DRAFT",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [memberRes, positionRes, salaryRes] = await Promise.all([
        axios.get("/member/list"),
        axios.get("/api/position-salaries"),
        axios.get("/api/salaries"),
      ]);

      setMembers(memberRes.data);
      setPositionSalaries(positionRes.data);
      setSalaries(salaryRes.data);
    } catch (err) {
      console.error(err);
      alert("데이터 로드 중 오류 발생");
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setForm({
      salaryId: "",
      memberId: null,
      positionId: null,
      salaryType: "MEMBER",
      baseSalary: 0,
      hourlyRate: 0,
      salaryMonth: "",
      payDate: "",
      grossPay: 0,
      netPay: 0,
      status: "DRAFT",
    });
  };

  // 회원 선택 시
  const handleMemberChange = (e) => {
    const id = Number(e.target.value) || null;
    const selectedMember = members.find((m) => m.id === id);

    if (selectedMember?.memberSalary) {
      // 개인 기준 급여가 있으면 MEMBER로 설정
      setForm({
        ...form,
        salaryType: "MEMBER",
        memberId: id,
        positionId: null,
        baseSalary: selectedMember.memberSalary.baseSalary,
        hourlyRate: selectedMember.memberSalary.hourlyRate,
      });
    } else {
      // 개인 기준 급여 없으면 빈 값, 직급 선택 가능
      setForm({
        ...form,
        salaryType: "MEMBER",
        memberId: id,
        positionId: null,
        baseSalary: 0,
        hourlyRate: 0,
      });
    }
  };

  // 직급 선택 시
  const handlePositionChange = (e) => {
    const id = Number(e.target.value) || null;
    const selectedPosition = positionSalaries.find((p) => p.id === id);
    setForm({
      ...form,
      salaryType: "POSITION",
      positionId: id,
      baseSalary: selectedPosition ? selectedPosition.baseSalary : 0,
      hourlyRate: selectedPosition ? selectedPosition.hourlyRate : 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      salaryType: form.salaryType,
      memberId: form.salaryType === "MEMBER" ? form.memberId : null,
      positionId: form.salaryType === "POSITION" ? form.positionId : null,
      hoursBaseSalary: Number(form.hourlyRate) || 0,
      grossPay: Number(form.baseSalary) || 0,
      netPay: Number(form.netPay) || 0,
      salaryMonth: form.salaryMonth,
      payDate: form.salaryMonth ? `${form.salaryMonth}-20` : "",
      status: "DRAFT",
    };

    try {
      if (form.salaryId) {
        await axios.put(`/api/salaries/${form.salaryId}`, payload);
        alert("급여 수정 완료!");
      } else {
        await axios.post("/api/salaries", payload);
        alert("급여 등록 완료!");
      }
      fetchData();
      handleClose();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const handleEdit = (s) => {
    setForm({
      salaryId: s.salaryId,
      memberId: s.memberId || null,
      positionId: s.positionId || null,
      salaryType: s.salaryType,
      baseSalary: s.baseSalary || 0,
      hourlyRate: s.hourlyRate || 0,
      salaryMonth: s.salaryMonth || "",
      payDate: s.payDate || "",
      netPay: s.netPay || 0,
      status: s.status || "DRAFT",
    });
    setShow(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/salaries/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
        alert("삭제 중 오류 발생");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">💰 급여 관리</h3>
      <Button variant="primary" onClick={handleShow}>
        + 급여 등록
      </Button>

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
          {salaries.map((s) => (
            <tr key={s.salaryId}>
              <td>{s.salaryId}</td>
              <td>{s.memberName}</td>
              <td>{s.salaryType}</td>
              <td>{s.baseSalary}</td>
              <td>{s.hourlyRate}</td>
              <td>{s.netPay}</td>
              <td>{s.status}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEdit(s)} className="me-1">
                  수정
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(s.salaryId)}>
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{form.salaryId ? "급여 수정" : "급여 등록"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>회원 선택</Form.Label>
                  <Form.Select value={form.memberId || ""} onChange={handleMemberChange}>
                    <option value="">선택</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.memberSalary ? `(개인 급여: ${m.memberSalary.baseSalary}원)` : ""}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>직급 급여 선택 (개인 기준 없을 때만)</Form.Label>
                  <Form.Select
                    value={form.positionId || ""}
                    onChange={handlePositionChange}
                    disabled={form.baseSalary > 0} // 개인 기준이 있으면 선택 불가
                  >
                    <option value="">선택</option>
                    {positionSalaries.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.baseSalary}원, 시급 {p.hourlyRate}원)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>기본급</Form.Label>
                  <Form.Control type="number" value={form.baseSalary} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>시급</Form.Label>
                  <Form.Control type="number" value={form.hourlyRate} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>급여월 (YYYY-MM)</Form.Label>
                  <Form.Control type="month" name="salaryMonth" value={form.salaryMonth} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>지급일 (서버 고정 20일)</Form.Label>
                  <Form.Control type="text" value={form.salaryMonth ? `${form.salaryMonth}-20` : ""} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4 text-end">
              <Button variant="secondary" onClick={handleClose} className="me-2">
                취소
              </Button>
              <Button type="submit" variant="primary">
                {form.salaryId ? "수정" : "등록"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
