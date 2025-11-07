import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "../api/api";

export default function SalaryManager() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [memberSalaries, setMemberSalaries] = useState([]);
  const [positionSalaries, setPositionSalaries] = useState([]);
  const [form, setForm] = useState({
    salaryId: null,
    salaryType: "MEMBER",
    memberId: null,
    positionId: null,
    baseSalary: 0,
    hourlyRate: 0,
    salaryMonth: "",
    netPay: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [m, p, s] = await Promise.all([
        axios.get("/api/member-salaries"),
        axios.get("/api/position-salaries"),
        axios.get("/api/salaries"),
      ]);
      setMemberSalaries(m.data);
      setPositionSalaries(p.data);
      setList(s.data);
    } catch (err) {
      console.error(err);
      alert("데이터 로드 중 오류 발생");
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setForm({
      salaryId: null,
      salaryType: "MEMBER",
      memberId: null,
      positionId: null,
      baseSalary: 0,
      hourlyRate: 0,
      salaryMonth: "",
      netPay: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalarySelection = (e) => {
    const id = Number(e.target.value) || null;
    if (form.salaryType === "MEMBER") {
      const selected = memberSalaries.find((m) => m.id === id);
      setForm((prev) => ({
        ...prev,
        memberId: id,
        baseSalary: selected ? selected.baseSalary : 0,
        hourlyRate: selected ? selected.hourlyRate : 0,
      }));
    } else {
      const selected = positionSalaries.find((p) => p.id === id);
      setForm((prev) => ({
        ...prev,
        positionId: id,
        baseSalary: selected ? selected.baseSalary : 0,
        hourlyRate: selected ? selected.hourlyRate : 0,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.salaryMonth) {
      alert("급여월을 선택해주세요.");
      return;
    }

    const payload = {
      salaryType: form.salaryType,
      memberId: form.salaryType === "MEMBER" ? form.memberId : null,
      positionId: form.salaryType === "POSITION" ? form.positionId : null,
      hoursBaseSalary: form.hourlyRate,
      grossPay: form.baseSalary,
      netPay: form.netPay,
      salaryMonth: form.salaryMonth,
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
      salaryType: s.salaryType,
      memberId: s.salaryType === "MEMBER" ? s.memberId : null,
      positionId: s.salaryType === "POSITION" ? s.positionId : null,
      baseSalary: s.baseSalary || 0,
      hourlyRate: s.hourlyRate || 0,
      salaryMonth: s.salaryMonth || "",
      netPay: s.netPay || 0,
    });
    setShow(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/salaries/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류 발생");
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
                  <Form.Label>급여 유형</Form.Label>
                  <Form.Select name="salaryType" value={form.salaryType} onChange={handleChange}>
                    <option value="MEMBER">개인</option>
                    <option value="POSITION">직급</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>{form.salaryType === "MEMBER" ? "회원 급여 선택" : "직급 급여 선택"}</Form.Label>
                  <Form.Select
                    value={form.salaryType === "MEMBER" ? form.memberId || "" : form.positionId || ""}
                    onChange={handleSalarySelection}
                  >
                    <option value="">선택</option>
                    {(form.salaryType === "MEMBER" ? memberSalaries : positionSalaries).map((item) => (
                      <option key={item.id} value={item.id}>
                        {form.salaryType === "MEMBER" ? item.memberName : item.title} ({item.baseSalary}원, 시급 {item.hourlyRate}원)
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
                  <Form.Control type="text" value={`${form.salaryMonth}-20`} readOnly />
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
