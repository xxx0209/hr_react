import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col, Pagination } from "react-bootstrap";
import SelectCombo from "../../sample/SelectCombo";
import axios from "../../api/api";

export default function SalaryManager() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberSalaries, setMemberSalaries] = useState([]);
  const [form, setForm] = useState({
    salaryId: "",
    memberId: "",
    salaryType: "",
    positionSalaryId: "",
    baseSalary: "",
    hourlyRate: "",
    salaryMonth: "",
    payDate: "",
    status: "DRAFT",
    availablePositionSalaries: [],
  });

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const formatNumber = (num) =>
    num === null || num === undefined || num === "" ? "" : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  useEffect(() => { fetchData(); }, [page, search]);

  const fetchData = async () => {
    try {
      const [membersRes, memberSalaryRes, salariesRes] = await Promise.all([
        axios.get("/member/list"),
        axios.get("/api/member-salaries"),
        axios.get("/api/salaries/drafts", { params: { page, size, search } }),
      ]);
      setMembers(membersRes.data);
      setMemberSalaries(memberSalaryRes.data);
      setList(salariesRes.data.content || []);
      setTotalPages(salariesRes.data.totalPages || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMemberChange = async (memberId) => {
    if (!memberId) return resetFormMember();
    const ms = memberSalaries.find((m) => m.memberId === memberId);
    if (ms) {
      setForm({ ...form, memberId, salaryType: "MEMBER", baseSalary: ms.baseSalary, hourlyRate: ms.hourlyRate, positionSalaryId: "", availablePositionSalaries: [] });
    } else {
      const res = await axios.get(`/api/position-salaries/member/${memberId}`);
      setForm({ ...form, memberId, salaryType: "POSITION", positionSalaryId: "", baseSalary: "", hourlyRate: "", availablePositionSalaries: res.data });
    }
  };

  const resetFormMember = () => setForm({ ...form, memberId: "", salaryType: "", baseSalary: "", hourlyRate: "", positionSalaryId: "", availablePositionSalaries: [] });

  const handlePositionSalaryChange = (id) => {
    if (!id) return setForm({ ...form, positionSalaryId: "", baseSalary: "", hourlyRate: "" });
    const ps = form.availablePositionSalaries.find((p) => p.id === id);
    if (ps) setForm({ ...form, positionSalaryId: id, baseSalary: ps.baseSalary, hourlyRate: ps.hourlyRate });
  };

  const handleSalaryMonthChange = (e) => setForm({ ...form, salaryMonth: e.target.value, payDate: e.target.value ? `${e.target.value}-20` : "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.salaryId) await axios.put(`/api/salaries/${form.salaryId}`, form);
      else await axios.post("/api/salaries", form);
      alert("저장 완료");
      fetchData();
      handleClose();
    } catch (err) {
      console.error(err);
      alert("오류 발생");
    }
  };

  const handleEdit = async (s) => {
    if (s.status === "COMPLETED") { alert("승인된 급여는 수정할 수 없습니다."); return; }
    let availablePositionSalaries = [];
    if (s.salaryType === "POSITION") {
      const res = await axios.get(`/api/position-salaries/member/${s.memberId}`);
      availablePositionSalaries = res.data;
    }
    setForm({ ...s, availablePositionSalaries });
    setShow(true);
  };

  const handleDelete = async (id, status) => {
    if (status === "COMPLETED") { alert("승인된 급여는 삭제할 수 없습니다."); return; }
    if (window.confirm("정말 삭제하시겠습니까?")) { await axios.delete(`/api/salaries/${id}`); fetchData(); }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("정말 급여를 승인하시겠습니까?")) return;
    await axios.post(`/api/salaries/${id}/approve`);
    fetchData();
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setForm({ salaryId: "", memberId: "", salaryType: "", positionSalaryId: "", baseSalary: "", hourlyRate: "", salaryMonth: "", payDate: "", status: "DRAFT", availablePositionSalaries: [] });
  };

  return (
    <div className="container mt-4">
      <h3>💰 급여 관리</h3>
      <Row className="mb-3">
        <Col md={6}><Button onClick={handleShow}>+ 급여 등록</Button></Col>
        <Col md={6}><Form.Control placeholder="검색 (회원명)" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} /></Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>회원명</th><th>유형</th><th>기본급</th><th>시급</th><th>급여월</th><th>상태</th><th>액션</th>
          </tr>
        </thead>
        <tbody>
          {list.map((s) => (
            <tr key={s.salaryId}>
              <td>{s.salaryId}</td>
              <td>{s.memberName}</td>
              <td>{s.salaryType}</td>
              <td>{formatNumber(s.baseSalary)}원</td>
              <td>{formatNumber(s.hourlyRate)}원</td>
              <td>{s.salaryMonth}</td>
              <td>{s.status}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEdit(s)} disabled={s.status === "COMPLETED"}>수정</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(s.salaryId, s.status)} disabled={s.status === "COMPLETED"}>삭제</Button>{' '}
                <Button size="sm" variant="success" onClick={() => handleApprove(s.salaryId)} disabled={s.status === "COMPLETED"}>승인</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>{i + 1}</Pagination.Item>
        ))}
      </Pagination>

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
                    disabled={!!form.salaryId || form.status === "COMPLETED"}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>직급 급여 선택</Form.Label>
                  <SelectCombo
                    options={form.availablePositionSalaries?.map((p) => ({
                      label: `${p.title} (${formatNumber(p.baseSalary)}원, 시급 ${formatNumber(p.hourlyRate)}원)`,
                      value: p.id,
                    }))}
                    value={form.positionSalaryId}
                    onChange={handlePositionSalaryChange}
                    placeholder="직급 선택"
                    disabled={form.salaryType === "MEMBER" || form.status === "COMPLETED"}
                  />
                  {form.salaryType === "MEMBER" && <Form.Text className="text-muted">개인 기준 급여가 등록된 회원입니다. (수정 불가)</Form.Text>}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>기본급</Form.Label>
                  <Form.Control value={form.baseSalary} readOnly={form.salaryType === "MEMBER" || form.status === "COMPLETED"} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>시급</Form.Label>
                  <Form.Control value={form.hourlyRate} readOnly={form.salaryType === "MEMBER" || form.status === "COMPLETED"} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>급여월</Form.Label>
                  <Form.Control type="month" value={form.salaryMonth || ""} onChange={handleSalaryMonthChange} disabled={form.status === "COMPLETED"} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>지급일</Form.Label>
                  <Form.Control value="20일" readOnly />
                  <Form.Text className="text-muted">지급일은 20일로 고정입니다.</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" disabled={form.status === "COMPLETED"}>{form.salaryId ? "수정" : "등록"}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
