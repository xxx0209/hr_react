import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";
import RadioGroup from "../sample/RadioGroup";

function MemberSalaryPage() {
  const [memberSalaries, setMemberSalaries] = useState([]);
  const [members, setMembers] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    memberId: "",
    baseSalary: "",
    hourlyRate: ""
  });

  /** 데이터 로드 */
  const fetchData = async () => {
    const [memRes, salRes] = await Promise.all([
      axios.get("/member/list"), // 회원 목록
      axios.get("/api/member-salaries") // 개인 급여 목록
    ]);
    setMembers(memRes.data);
    setMemberSalaries(salRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /** 등록/수정 모달 열기 */
  const handleShow = (salary = null) => {
    if (salary) {
      setEditing(true);
      setFormData({
        id: salary.id,
        memberId: salary.memberId,
        memberName: salary.memberName
        baseSalary: salary.baseSalary,
        hourlyRate: salary.hourlyRate
      });
    } else {
      setEditing(false);
      setFormData({
        id: "",
        memberId: "",
        memberName:"",
        baseSalary: "",
        hourlyRate: ""
      });
    }
    setShow(true);
  };

  /** 저장 */
  const handleSave = async () => {
    if (!formData.memberId) {
      alert("회원을 선택해주세요!");
      return;
    }

    const payload = {
      memberId: formData.memberId,
      baseSalary: formData.baseSalary,
      hourlyRate: formData.hourlyRate
    };

    try {
      let response;
      if (editing) {
        response = await axios.put(`/api/member-salaries/${formData.id}`, payload);
      } else {
        response = await axios.post("/api/member-salaries", payload);
      }

      if (response.status === 200) {
        alert("저장되었습니다.");
      }
      setShow(false);
      fetchData();
    } catch (err) {
      alert("오류 발생: " + err);
    }
  };

  /** 삭제 */
  const handleDelete = async (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      await axios.delete(`/api/member-salaries/${id}`);
      fetchData();
    }
  };

  return (
    <div className="container mt-4">
      <h3>개인별 급여 관리</h3>
      <Button className="mb-3" onClick={() => handleShow()}>
        + 개인 급여 등록
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>회원명</th>
            <th>기본급</th>
            <th>시급</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {memberSalaries.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.memberName}</td>
              <td>{s.baseSalary}</td>
              <td>{s.hourlyRate}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShow(s)}
                >
                  수정
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(s.id)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 모달 */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "개인 급여 수정" : "개인 급여 등록"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>회원 선택</Form.Label>
              <SelectCombo
                options={members}
                value={formData.memberId}
                onChange={(v) => setFormData({ ...formData, memberId: v })}
                placeholder={"회원 선택"}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>기본급</Form.Label>
              <Form.Control
                type="number"
                value={formData.baseSalary}
                onChange={(e) =>
                  setFormData({ ...formData, baseSalary: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>시급</Form.Label>
              <Form.Control
                type="number"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData({ ...formData, hourlyRate: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editing ? "수정 저장" : "등록"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MemberSalaryPage;
