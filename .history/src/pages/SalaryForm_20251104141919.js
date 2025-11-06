import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";

export default function SalaryManager() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [members, setMembers] = useState([]);
  const [positionSalaries, setPositionSalaries] = useState([]);
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // const [m, p, s] = await Promise.all([
    const [m] = await Promise.all([
      axios.get("/member/list"),
      //axios.get("/api/position-salaries"),
      // axios.get("/api/salaries"),
    ]);
    setMembers(m.data);
    // setPositionSalaries(p.data);
    // setList(s.data);
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
      status: "PENDING",
    });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleChange2 = (e) => {
    setForm({ ...form, ['memberId']: e });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.salaryId) {
      await axios.put(`/api/salaries/${form.salaryId}`, form);
      alert("급여 수정 완료!");
    } else {
      await axios.post("/api/salaries", form);
      alert("급여 등록 완료!");
    }
    fetchData();
    handleClose();
  };

  const handleEdit = (s) => {
    setForm({
      ...s,
      salaryId: s.salaryId,
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

      {/* 목록 테이블 */}
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
                <Button size="sm" variant="danger" onClick={() => handleDelete(s.salaryId)}>
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
                  <SelectCombo
                    label="회원 선택"
                    options={members}
                    value={form.memberId}
                    onChange={(v) => handleChange2(v)}
                    searchable={true}
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
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
                <Form.Select
                  name="positionSalaryId"
                  value={form.positionSalaryId}
                  onChange={handleChange}
                >
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

            <Row className="mt-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>총지급액</Form.Label>
                  <Form.Control
                    type="number"
                    name="grossPay"
                    value={form.grossPay}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>공제액</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalDeduction"
                    value={form.totalDeduction}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>순지급액</Form.Label>
                  <Form.Control
                    type="number"
                    name="netPay"
                    value={form.netPay}
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
