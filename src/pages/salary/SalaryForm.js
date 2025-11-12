import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "../../api/api";
import SelectCombo from "../../sample/SelectCombo";

export default function SalaryManager() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberSalaries, setMemberSalaries] = useState([]);
  const [form, setForm] = useState(getInitialForm());

  function getInitialForm() {
    return {
      salaryId: "",
      memberId: "",
      salaryType: "",
      positionSalaryId: "",
      baseSalary: "",
      hourlyRate: "",
      salaryMonth: "",
      payDate: "",
      status: "DRAFT",
      title: "",
      positionName: "", // ✅ 직급명 추가
      availablePositionSalaries: [],
    };
  }

  const formatNumber = (num) =>
    num === null || num === undefined || num === ""
      ? ""
      : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, memberSalaryRes, salariesRes] = await Promise.all([
        axios.get("/member/list"),
        axios.get("/api/member-salaries"),
        axios.get("/api/salaries/drafts"),
      ]);

      setMembers(membersRes.data.content || membersRes.data);
      setMemberSalaries(memberSalaryRes.data.content || memberSalaryRes.data);
      setList(salariesRes.data.content || salariesRes.data);
    } catch (err) {
      console.error("데이터 로딩 실패", err);
    }
  };

  const handleShow = () => {
    setForm(getInitialForm());
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setForm(getInitialForm());
  };

  const handleMemberChange = async (memberId) => {
    if (!memberId) {
      setForm(getInitialForm());
      return;
    }

    const memberSalary = memberSalaries.find((ms) => ms.memberId === memberId);

    if (memberSalary) {
      setForm({
        ...form,
        memberId,
        salaryType: "MEMBER",
        baseSalary: memberSalary.baseSalary,
        hourlyRate: memberSalary.hourlyRate,
        title: memberSalary.title,
        positionName: memberSalary.positionName, // ✅ 직급명 저장
        positionSalaryId: "",
        availablePositionSalaries: [],
      });
      return;
    }

    try {
      const res = await axios.get(`/api/position-salaries/member/${memberId}`);
      setForm({
        ...form,
        memberId,
        salaryType: "POSITION",
        baseSalary: "",
        hourlyRate: "",
        title: "",
        positionName: "",
        positionSalaryId: "",
        availablePositionSalaries: res.data.content || res.data,
      });
    } catch (err) {
      console.error("직급 급여 불러오기 실패", err);
    }
  };

  const handlePositionSalaryChange = (id) => {
    if (!id) {
      return setForm({
        ...form,
        positionSalaryId: "",
        baseSalary: "",
        hourlyRate: "",
        title: "",
        positionName: "",
      });
    }

    const posId = Number(id);
    const ps = form.availablePositionSalaries.find((p) => p.id === posId);

    if (ps) {
      setForm({
        ...form,
        positionSalaryId: posId,
        baseSalary: ps.baseSalary,
        hourlyRate: ps.hourlyRate,
        title: ps.title,
        positionName: ps.positionName, // ✅ 직급명 저장
      });
    }
  };

  const handleSalaryMonthChange = (e) => {
    const salaryMonth = e.target.value;
    const payDate = salaryMonth ? `${salaryMonth}-20` : "";
    setForm({ ...form, salaryMonth, payDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.salaryType === "POSITION" && !form.positionSalaryId) {
      return alert("직급 기준급을 선택해주세요.");
    }

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

  const handleEdit = async (s) => {
    if (s.status === "COMPLETED")
      return alert("승인된 급여는 수정할 수 없습니다.");

    let availablePositionSalaries = [];
    if (s.salaryType === "POSITION") {
      const res = await axios.get(`/api/position-salaries/member/${s.memberId}`);
      availablePositionSalaries = res.data.content || res.data;
    }

    setForm({
      ...s,
      availablePositionSalaries,
    });

    setShow(true);
  };

  const handleDelete = async (id, status) => {
    if (status === "COMPLETED") return alert("승인된 급여는 삭제 불가");
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    await axios.delete(`/api/salaries/${id}`);
    fetchData();
  };

  const handleApprove = async (id) => {
    if (!window.confirm("정말 승인하시겠습니까?")) return;
    await axios.post(`/api/salaries/${id}/approve`);
    fetchData();
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">💰 급여 관리</h3>
      <Button variant="primary" onClick={handleShow}>+ 급여 등록</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>회원명</th>
            <th>유형</th>
            <th>기본급</th>
            <th>시급</th>
            <th>급여월</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">데이터가 없습니다</td>
            </tr>
          ) : (
            list.map((s) => (
              <tr key={s.salaryId}>
                <td>{s.salaryId}</td>
                <td>{s.memberName}</td>
                <td>
                  {s.salaryType === "POSITION"
                    ? `직급 (${s.title || "-"})`
                    : s.salaryType === "MEMBER"
                      ? "개인 급여"
                      : "-"
                  }
                </td>
                <td>{formatNumber(s.baseSalary)}원</td>
                <td>{formatNumber(s.hourlyRate)}원</td>
                <td>{s.salaryMonth}</td>
                <td>{s.status}</td>
                <td>
                  {s.salaryType === "POSITION" && (
                    <>
                      <Button size="sm" variant="warning" className="me-1"
                        onClick={() => handleEdit(s)}
                        disabled={s.status === "COMPLETED"}>
                        수정
                      </Button>
                      <Button size="sm" variant="danger" className="me-1"
                        onClick={() => handleDelete(s.salaryId, s.status)}
                        disabled={s.status === "COMPLETED"}>
                        삭제
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="success"
                    onClick={() => handleApprove(s.salaryId)}
                    disabled={s.status === "COMPLETED"}>
                    승인
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

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
                  <SelectCombo
                    options={members.map((m) => ({ label: m.name, value: m.id }))}
                    value={form.memberId}
                    onChange={handleMemberChange}
                    placeholder="회원 선택"
                    disabled={!!form.salaryId}
                    searchable
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>직급 급여 선택</Form.Label>
                  <SelectCombo
                    options={form.availablePositionSalaries.map((p) => ({
                      label: `${p.positionName} (${p.title}) (${formatNumber(p.baseSalary)}원 / 시급 ${formatNumber(p.hourlyRate)}원)`,
                      value: p.id,
                    }))}
                    value={form.positionSalaryId}
                    onChange={handlePositionSalaryChange}
                    placeholder="직급 선택"
                    disabled={form.salaryType === "MEMBER"}
                    searchable
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>기본급</Form.Label>
                  <Form.Control
                    value={formatNumber(form.baseSalary)}
                    readOnly={form.salaryType === "MEMBER"}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>시급</Form.Label>
                  <Form.Control
                    value={formatNumber(form.hourlyRate)}
                    readOnly={form.salaryType === "MEMBER"}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>급여월</Form.Label>
                  <Form.Control
                    type="month"
                    value={form.salaryMonth || ""}
                    onChange={handleSalaryMonthChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>지급일</Form.Label>
                  <Form.Control value="20일" readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary">
              {form.salaryId ? "수정" : "등록"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
