import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "../api/api";

export default function SalaryManager() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [members, setMembers] = useState([]);
  const [positionSalaries, setPositionSalaries] = useState([]); // 선택한 회원의 직급 급여 목록만 저장
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
    status: "DRAFT",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [membersRes, salariesRes] = await Promise.all([
      axios.get("/member/list"),
      axios.get("/api/salaries"),
    ]);
    setMembers(membersRes.data);
    setList(salariesRes.data);
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
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
      status: "DRAFT",
    });
    setPositionSalaries([]); // 닫을 때 초기화
  };

  // 회원 선택 시
  const handleMemberChange = async (e) => {
    const memberId = e.target.value;
    const member = members.find((m) => m.id === memberId);

    if (!member) return;

    try {
      // 회원의 직급 기준 급여 가져오기
      const res = await axios.get(`/api/position-salaries/member/${memberId}`);
      const positionSalaryList = res.data || [];
      setPositionSalaries(positionSalaryList);

      // 개인 기준 급여가 있으면 MEMBER, 없으면 POSITION
      if (member.memberSalary) {
        setForm({
          ...form,
          memberId,
          salaryType: "MEMBER",
          positionSalaryId: "",
          baseSalary: member.memberSalary.baseSalary || "",
          hourlyRate: member.memberSalary.hourlyRate || "",
        });
      } else {
        setForm({
          ...form,
          memberId,
          salaryType: "POSITION",
          positionSalaryId: "",
          baseSalary: "",
          hourlyRate: "",
        });
      }
    } catch (err) {
      console.error("직급 급여 불러오기 실패:", err);
      setPositionSalaries([]);
    }
  };

  // 직급 급여 선택 시 급여 자동 적용
  const handlePositionChange = (e) => {
    const id = Number(e.target.value);
    const selected = positionSalaries.find((p) => p.id === id);
    setForm({
      ...form,
      positionSalaryId: id,
      baseSalary: selected ? selected.baseSalary : "",
      hourlyRate: selected ? selected.hourlyRate : "",
      salaryType: "POSITION",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.salaryId) {
        await axios.put(`/api/salaries/${form.salaryId}`, form);
        alert("급여 수정 완료!");
      } else {
        await axios.post("/api/salaries", form);
        alert("급여 등록 완료!");
      }
      fetchData();
      handleClose();
    } catch (err) {
      console.error(err);
      alert("오류 발생!");
    }
  };

  const handleEdit = (s) => {
    setForm({
      ...s,
      memberId: s.memberId,
      salaryType: s.salaryType,
      positionSalaryId: s.positionSalaryId || "",
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
      fetchData();
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

      {/* 급여 등록/수정 모달 */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{form.salaryId ? "급여 수정" : "급여 등록"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>회원 선택</Form.Label>
                  <Form.Select
                    value={form.memberId}
                    onChange={handleMemberChange}
                    required
                  >
                    <option value="">선택</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.position?.positionName})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>직급 급여 선택 (개인 기준 없을 때만)</Form.Label>
                  <Form.Select
                    value={form.positionSalaryId}
                    onChange={handlePositionChange}
                    disabled={form.salaryType === "MEMBER"}
                  >
                    <option value="">선택</option>
                    {positionSalaries.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.baseSalary}원 / {p.hourlyRate}원)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>기본급</Form.Label>
                  <Form.Control value={form.baseSalary} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>시급</Form.Label>
                  <Form.Control value={form.hourlyRate} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>급여월</Form.Label>
                  <Form.Control
                    type="month"
                    name="salaryMonth"
                    value={form.salaryMonth}
                    onChange={handleChange}
                    required
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
                {form.salaryId ? "수정" : "등록"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
