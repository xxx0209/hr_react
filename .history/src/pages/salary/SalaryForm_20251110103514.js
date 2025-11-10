import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "../../api/api";
import SelectCombo from "../sample/SelectCombo";

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
        axios.get("/api/salaries/drafts"), // 승인 전 급여 목록
      ]);
      setMembers(membersRes.data);
      setMemberSalaries(memberSalaryRes.data);
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

  /** ✅ 회원 선택 시 로직
  
  * MemberSalary 존재 → MEMBER 타입 급여
  * 없으면 PositionSalary 기준으로 POSITION 타입 급여 */
  const handleMemberChange = async (memberId) => {
    if (!memberId) {
      resetFormMember();
      return;
    }


    const memberSalary = memberSalaries.find((ms) => ms.memberId === memberId);



    if (memberSalary) {
      // MEMBER 기준 급여
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
      // POSITION 기준 급여
      try {
        const res = await axios.get(`/api/position-salaries/member/${memberId}`);
        setForm({
          ...form,
          memberId,
          salaryType: "POSITION",
          baseSalary: "",
          hourlyRate: "",
          positionSalaryId: "",
          availablePositionSalaries: res.data,
        });
      } catch (err) {
        console.error("직급 급여 불러오기 실패", err);
      }
    }


  };

  const resetFormMember = () =>
    setForm({
      ...form,
      memberId: "",
      salaryType: "",
      baseSalary: "",
      hourlyRate: "",
      positionSalaryId: "",
      availablePositionSalaries: [],
    });

  /** ✅ POSITION 급여 선택 시 해당 기준급/시급 복사 */
  const handlePositionSalaryChange = (id) => {
    if (!id) {
      setForm({
        ...form,
        positionSalaryId: "",
        baseSalary: "",
        hourlyRate: "",
      });
      return;
    }
    const ps = form.availablePositionSalaries.find((p) => p.id === id);
    if (ps) {
      setForm({
        ...form,
        positionSalaryId: id,
        baseSalary: ps.baseSalary,
        hourlyRate: ps.hourlyRate,
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
    try {
      // baseSalary/hourlyRate는 이미 복사된 상태로 전송됨
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

  /** ✅ 급여 수정 (단, 승인된 건 수정 불가) */
  const handleEdit = async (s) => {
    if (s.status === "COMPLETED") {
      alert("승인된 급여는 수정할 수 없습니다.");
      return;
    }


    let availablePositionSalaries = [];
    if (s.salaryType === "POSITION") {
      try {
        const res = await axios.get(`/api/position-salaries/member/${s.memberId}`);
        availablePositionSalaries = res.data;
      } catch (err) {
        console.error("직급 급여 불러오기 실패", err);
      }
    }

    setForm({
      ...s,
      availablePositionSalaries,
    });
    setShow(true);


  };

  /** ✅ 승인된 급여는 삭제 불가 */
  const handleDelete = async (id, status) => {
    if (status === "COMPLETED") {
      alert("승인된 급여는 삭제할 수 없습니다.");
      return;
    }
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await axios.delete(`/api/salaries/${id}`);
      fetchData();
    }
  };

  /** ✅ 급여 승인 */
  const handleApprove = async (id) => {
    if (!window.confirm("정말 급여를 승인하시겠습니까?")) return;
    try {
      await axios.post(`/api/salaries/${id}/approve`);
      alert("급여가 승인되었습니다.");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("승인 중 오류가 발생했습니다.");
    }
  };

  return (<div className="container mt-4"> <h3 className="mb-3">💰 급여 관리</h3> <Button variant="primary" onClick={handleShow}>
    + 급여 등록 </Button>

    ```
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
              <Button
                size="sm"
                variant="warning"
                onClick={() => handleEdit(s)}
                className="me-1"
                disabled={s.status === "COMPLETED"}
              >
                수정
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(s.salaryId, s.status)}
                className="me-1"
                disabled={s.status === "COMPLETED"}
              >
                삭제
              </Button>
              <Button
                size="sm"
                variant="success"
                onClick={() => handleApprove(s.salaryId)}
                disabled={s.status === "COMPLETED"}
              >
                승인
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
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>회원 선택</Form.Label>
                <SelectCombo
                  options={members.map((m) => ({
                    label: m.name,
                    value: m.id,
                  }))}
                  value={form.memberId}
                  onChange={handleMemberChange}
                  placeholder="회원 선택"
                  disabled={!!form.salaryId || form.status === "COMPLETED"}
                  searchable
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>직급 급여 선택</Form.Label>
                <SelectCombo
                  options={form.availablePositionSalaries?.map((p) => ({
                    label: `${p.title} (${formatNumber(p.baseSalary)}원, 시급 ${formatNumber(
                      p.hourlyRate
                    )}원)`,
                    value: p.id,
                  }))}
                  value={form.positionSalaryId}
                  onChange={handlePositionSalaryChange}
                  placeholder="직급 선택"
                  disabled={form.salaryType === "MEMBER" || form.status === "COMPLETED"}
                  searchable
                />
                {form.salaryType === "MEMBER" && (
                  <Form.Text className="text-muted">
                    개인 기준 급여가 등록된 회원입니다. (수정 불가)
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>기본급</Form.Label>
                <Form.Control
                  value={formatNumber(form.baseSalary)}
                  readOnly={form.salaryType === "MEMBER" || form.status === "COMPLETED"}
                  onChange={(e) => setForm({ ...form, baseSalary: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>시급</Form.Label>
                <Form.Control
                  value={formatNumber(form.hourlyRate)}
                  readOnly={form.salaryType === "MEMBER" || form.status === "COMPLETED"}
                  onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
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
                  name="salaryMonth"
                  value={form.salaryMonth || ""}
                  onChange={handleSalaryMonthChange}
                  required
                  disabled={form.status === "COMPLETED"}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>지급일</Form.Label>
                <Form.Control type="text" value="20일" readOnly />
                <Form.Text className="text-muted">지급일은 20일로 고정입니다.</Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" disabled={form.status === "COMPLETED"}>
            {form.salaryId ? "수정" : "등록"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  </div>


  );
}
