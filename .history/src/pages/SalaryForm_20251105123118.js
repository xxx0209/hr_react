import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";

export default function SalaryManager() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [membersSalaries, setMembersSalaries] = useState([]);
  const [positionSalaries, setPositionSalaries] = useState([]);
  const [form, setForm] = useState({
    salaryId: "",
    memberId: "",
    salaryType: "MEMBER", // 'MEMBER' or 'POSITION'
    memberSalaryId: "",
    positionSalaryId: "",
    baseSalary: "",
    hourlyRate: "",
    salaryMonth: "",
    payDate: "2025-11-20", // 지급일 고정 (20일로 설정)
    grossPay: "",
    totalDeduction: "",
    netPay: "",
    status: "DRAFT",
  });

  // API 데이터 가져오기
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, positionsRes, salariesRes] = await Promise.all([
        axios.get("/api/member-salaries"),
        axios.get("/api/position-salaries"),
        axios.get("/api/salaries"),
      ]);
      setMembersSalaries(membersRes.data);
      setPositionSalaries(positionsRes.data);
      setList(salariesRes.data);
    } catch (error) {
      console.error("데이터를 불러오는 데 실패했습니다.", error);
      alert("데이터를 불러오는 데 실패했습니다.");
    }
  };

  // 모달 열기
  const handleShow = () => setShow(true);

  // 모달 닫기 및 폼 초기화
  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  // 폼 초기화
  const resetForm = () => {
    setForm({
      salaryId: "",
      memberId: "",
      salaryType: "MEMBER",
      memberSalaryId: "",
      positionSalaryId: "",
      baseSalary: "",
      hourlyRate: "",
      salaryMonth: "",
      payDate: "2025-11-20", // 지급일 고정
      grossPay: "",
      totalDeduction: "",
      netPay: "",
      status: "DRAFT",
    });
  };

  // 폼 데이터 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // 회원 급여 변경
  const handleMemberSalaryChange = (e) => {
    const id = Number(e.target.value);
    const selected = membersSalaries.find((m) => m.id === id);
    setForm((prevForm) => ({
      ...prevForm,
      memberSalaryId: id,
      baseSalary: selected ? selected.baseSalary : "",
      hourlyRate: selected ? selected.hourlyRate : "",
    }));
  };

  // 직급 급여 변경
  const handlePositionSalaryChange = (e) => {
    const id = Number(e.target.value);
    const selected = positionSalaries.find((p) => p.id === id);
    setForm((prevForm) => ({
      ...prevForm,
      positionSalaryId: id,
      baseSalary: selected ? selected.baseSalary : "",
      hourlyRate: selected ? selected.hourlyRate : "",
    }));
  };

  // 급여 등록/수정 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.salaryId) {
        // 급여 수정
        await axios.put(`/api/salaries/${form.salaryId}`, form);
        alert("급여 수정 완료!");
      } else {
        // 급여 등록
        await axios.post("/api/salaries", form);
        alert("급여 등록 완료!");
      }
      fetchData(); // 데이터 새로고침
      handleClose(); // 모달 닫기
    } catch (error) {
      console.error("급여 등록/수정에 실패했습니다.", error);
      alert("급여 등록/수정에 실패했습니다.");
    }
  };

  // 급여 수정
  const handleEdit = (salary) => {
    setForm({
      ...salary,
      salaryId: salary.salaryId,
      memberSalaryId: salary.memberSalaryId || "",
      positionSalaryId: salary.positionSalaryId || "",
      baseSalary: salary.baseSalary || "",
      hourlyRate: salary.hourlyRate || "",
      salaryMonth: salary.salaryMonth,
      payDate: salary.payDate || "2025-11-20", // 급여 지급일을 20일로 설정
      grossPay: salary.grossPay,
      totalDeduction: salary.totalDeduction,
      netPay: salary.netPay,
      status: salary.status,
    });
    setShow(true);
  };

  // 급여 삭제
  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/salaries/${id}`);
        fetchData(); // 데이터 새로고침
      } catch (error) {
        console.error("급여 삭제에 실패했습니다.", error);
        alert("급여 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">💰 급여 관리</h3>
      <Button variant="primary" onClick={handleShow}>
        + 급여 등록
      </Button>

      {/* 급여 목록 테이블 */}
      <Table striped bordered hover className="mt-3">
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
                <Form.Group>
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
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>기본급</Form.Label>
                  <Form.Control type="number" name="baseSalary" value={form.baseSalary} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>시급</Form.Label>
                  <Form.Control type="number" name="hourlyRate" value={form.hourlyRate} readOnly />
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
                    value={form.payDate} // 20일로 고정
                    readOnly
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
