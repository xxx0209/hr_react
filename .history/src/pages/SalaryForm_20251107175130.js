import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";

export default function SalaryManager() {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberSalaries, setMemberSalaries] = useState([]);
  const [positionSalaries, setPositionSalaries] = useState([]);

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

  const formatNumber = (num) => {
    if (num === null || num === undefined || num === "") return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, memberSalaryRes, positionsRes, salariesRes] =
        await Promise.all([
          axios.get("/member/list"),
          axios.get("/api/member-salaries"),
          axios.get("/api/position-salaries"),
          axios.get("/api/salaries/drafts"),
        ]);
      setMembers(membersRes.data);
      setMemberSalaries(memberSalaryRes.data);
      setPositionSalaries(positionsRes.data);
      setList(salariesRes.data);
    } catch (err) {
      console.error("데이터 로딩 실패", err);

    }
  };
  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setForm({
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
  };

  const handleMemberChange = async (memberId) => {
    if (!memberId) {
      setForm({
        ...form,
        memberId: "",
        salaryType: "",
        baseSalary: "",
        hourlyRate: "",
        positionSalaryId: "",
        availablePositionSalaries: [],
      });
      return;
    }

    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const memberSalary = memberSalaries.find((ms) =>
      ms.memberId === memberId);
    if (memberSalary) {
      setForm({
        ...form,
        memberId,
        salaryType: "MEMBER",
        baseSalary: memberSalary.baseSalary,
        hourlyRate: memberSalary.hourlyRate,
        positionSalaryId: "",
        availablePositionSalaries: [],
      });
    } else {
      try {
        const res = await axios.get(`/api/position - salaries / member / ${memberId}`);
        setForm({ 
          ...form,
           memberId, 
           salaryType: "POSITION", 
           baseSalary: "", 
           hourlyRate: "",
            positionSalaryId: "", availablePositionSalaries: res.data, });
      } catch (err) { console.error("직급 급여 불러오기 실패", err); }
    }
  }; const handlePositionSalaryChange = (id) => { if (!id) { setForm({ ...form, positionSalaryId: "", baseSalary: "", hourlyRate: "", }); return; } const positionSalary = form.availablePositionSalaries.find((ps) => ps.id === id); if (!positionSalary) return; setForm({ ...form, positionSalaryId: id, baseSalary: positionSalary.baseSalary, hourlyRate: positionSalary.hourlyRate, }); }; const handleSalaryMonthChange = (e) => { const salaryMonth = e.target.value; const payDate = salaryMonth ? ${ salaryMonth }-20 : ""; setForm({ ...form, salaryMonth, payDate }); }; const handleChange = (e) => { const { name, value } = e.target; setForm({ ...form, [name]: value }); }; const handleSubmit = async (e) => { e.preventDefault(); try { if (form.salaryId) { await axios.put(/api/salaries / ${ form.salaryId }, form); alert("급여 수정 완료!"); } else { await axios.post("/api/salaries", form); alert("급여 등록 완료!"); } fetchData(); handleClose(); } catch (err) { console.error(err); alert("오류 발생!"); } }; const handleEdit = async (s) => { let availablePositionSalaries = []; if (s.salaryType === "POSITION") { try { const res = await axios.get(/api/position - salaries / member / ${ s.memberId }); availablePositionSalaries = res.data; } catch (err) { console.error("직급 급여 불러오기 실패", err); } } setForm({ ...s, memberId: s.memberId, salaryType: s.salaryType, positionSalaryId: s.positionSalaryId || "", baseSalary: s.baseSalary || "", hourlyRate: s.hourlyRate || "", salaryMonth: s.salaryMonth || "", payDate: s.payDate || "", status: s.status, availablePositionSalaries, }); setShow(true); }; const handleDelete = async (id) => { if (window.confirm("정말 삭제하시겠습니까?")) { await axios.delete(/api/salaries / ${ id }); fetchData(); } }; const handleApprove = async (id) => { if (!window.confirm("정말 급여를 승인하시겠습니까?")) return; try { await axios.post(/api/salaries / ${ id } / approve); alert("급여가 승인되었습니다."); fetchData(); } catch (err) { console.error(err); alert("승인 중 오류가 발생했습니다."); } }; return (<div className="container mt-4"> <h3 className="mb-3">💰 급여 관리</h3> <Button variant="primary" onClick={handleShow}> + 급여 등록 </Button> <Table striped bordered hover className="mt-3"> <thead> <tr> <th>ID</th> <th>회원명</th> <th>유형</th> <th>기본급</th> <th>시급</th> <th>급여월</th> <th>상태</th> <th>액션</th> </tr> </thead> <tbody> {list.map((s) => (<tr key={s.salaryId}> <td>{s.salaryId}</td> <td>{s.memberName}</td> <td>{s.salaryType}</td> <td>{formatNumber(s.baseSalary)}원</td> <td>{formatNumber(s.hourlyRate)}원</td> <td>{s.salaryMonth}</td> <td>{s.status}</td> <td> {s.salaryType !== "MEMBER" && (<Button size="sm" variant="warning" onClick={() => handleEdit(s)} className="me-1" > 수정 </Button>)} <Button size="sm" variant="danger" onClick={() => handleDelete(s.salaryId)} className="me-1" > 삭제 </Button> <Button size="sm" variant="success" onClick={() => handleApprove(s.salaryId)} disabled={s.status === "COMPLETED"} > 승인 </Button> </td> </tr>))} </tbody> </Table> <Modal show={show} onHide={handleClose} size="lg"> <Modal.Header closeButton> <Modal.Title>{form.salaryId ? "급여 수정" : "급여 등록"}</Modal.Title> </Modal.Header> <Modal.Body> <Form onSubmit={handleSubmit}> <Row className="mb-3"> <Col md={6}> <Form.Group> <Form.Label>회원 선택</Form.Label> <SelectCombo options={members.map(m => ({ label: m.name, value: m.id }))} value={form.memberId} onChange={handleMemberChange} placeholder="회원 선택" disabled={!!form.salaryId} searchable required /> </Form.Group> </Col> <Col md={6}> <Form.Group> <Form.Label>직급 급여 선택</Form.Label> <SelectCombo options={form.availablePositionSalaries?.map(p => ({ label: ${ p.title }(${ formatNumber(p.baseSalary)} 원, 시급 ${formatNumber(p.hourlyRate)}원), value: p.id }))} value={form.positionSalaryId} onChange={handlePositionSalaryChange} placeholder="직급 선택" disabled={form.salaryType === "MEMBER"} searchable /> {form.salaryType === "MEMBER" && (<Form.Text className="text-muted"> 개인 기준 급여가 등록된 회원입니다. </Form.Text>)} </Form.Group> </Col> </Row> <Row className="mb-3"> <Col md={6}> <Form.Group> <Form.Label>기본급</Form.Label> <Form.Control value={formatNumber(form.baseSalary)} readOnly /> </Form.Group> </Col> <Col md={6}> <Form.Group> <Form.Label>시급</Form.Label> <Form.Control value={formatNumber(form.hourlyRate)} readOnly /> </Form.Group> </Col> </Row> <Row className="mb-3"> <Col md={6}> <Form.Group> <Form.Label>급여월</Form.Label> <Form.Control type="month" name="salaryMonth" value={form.salaryMonth || ""} onChange={handleSalaryMonthChange} required /> </Form.Group> </Col> <Col md={6}> <Form.Group> <Form.Label>지급일</Form.Label> <Form.Control type="text" value="20일" readOnly /> <Form.Text className="text-muted"> 지급일은 20일로 고정입니다. </Form.Text> </Form.Group> </Col> </Row> <Button variant="primary" type="submit"> {form.salaryId ? "수정" : "등록"} </Button> </Form> </Modal.Body> </Modal> </div>);
}