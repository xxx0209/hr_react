import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";
import RadioGroup from "../sample/RadioGroup";

function SalaryForm({ show, handleClose, onSave, editSalary }) {
  const [formData, setFormData] = useState({
    memberId: "",
    salaryMonth: "",
    payDate: "",
    salaryType: "POSITION",
    positionSalaryId: "",
    memberSalaryId: "",
    baseSalary: "",
    hourlyRate: "",
    status: "DRAFT",
    title: "",
    active: true,
  });

  const [members, setMembers] = useState([]);
  const [positionSalaries, setPositionSalaries] = useState([]);
  const [memberSalaries, setMemberSalaries] = useState([]);

  // ✅ 데이터 불러오기
  useEffect(() => {
    axios.get("/members").then((res) => setMembers(res.data));
    axios.get("/position-salaries").then((res) => setPositionSalaries(res.data));
    axios.get("/member-salaries").then((res) => setMemberSalaries(res.data));
  }, []);

  // ✅ 수정 모드 시 데이터 세팅
  useEffect(() => {
    if (editSalary) {
      setFormData({
        memberId: editSalary.member?.id || "",
        salaryMonth: editSalary.salaryMonth || "",
        payDate: editSalary.payDate || "",
        salaryType: editSalary.salaryType || "POSITION",
        positionSalaryId: editSalary.positionSalary?.id || "",
        memberSalaryId: editSalary.memberSalary?.id || "",
        baseSalary: editSalary.baseSalary || "",
        hourlyRate: editSalary.hourlyRate || "",
        status: editSalary.status || "DRAFT",
        title: editSalary.title || "",
        active: editSalary.active ?? true,
      });
    } else {
      setFormData({
        memberId: "",
        salaryMonth: "",
        payDate: "",
        salaryType: "POSITION",
        positionSalaryId: "",
        memberSalaryId: "",
        baseSalary: "",
        hourlyRate: "",
        status: "DRAFT",
        title: "",
        active: true,
      });
    }
  }, [editSalary]);

  // ✅ 입력 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ 급여유형 변경 시 다른 필드 초기화
  const handleSalaryTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      salaryType: value,
      positionSalaryId: "",
      memberSalaryId: "",
      baseSalary: "",
      hourlyRate: "",
    }));
  };

  // ✅ 기준급 선택 시 해당 기본급/시급 자동 세팅
  const handlePositionSalaryChange = (e) => {
    const pos = positionSalaries.find(
      (p) => p.id.toString() === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      positionSalaryId: e.target.value,
      baseSalary: pos?.baseSalary || "",
      hourlyRate: pos?.hourlyRate || "",
    }));
  };

  const handleMemberSalaryChange = (e) => {
    const mem = memberSalaries.find(
      (m) => m.id.toString() === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      memberSalaryId: e.target.value,
      baseSalary: mem?.baseSalary || "",
      hourlyRate: mem?.hourlyRate || "",
    }));
  };

  // ✅ 저장 버튼 클릭
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      memberId: formData.memberId,
      positionSalaryId:
        formData.salaryType === "POSITION" ? formData.positionSalaryId : null,
      memberSalaryId:
        formData.salaryType === "MEMBER" ? formData.memberSalaryId : null,
    };

    try {
      if (editSalary) {
        await axios.put(`/salaries/${editSalary.salaryId}`, payload);
      } else {
        await axios.post("/salaries", payload);
      }
      onSave();
      handleClose();
    } catch (error) {
      console.error("급여 저장 오류:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>급여 {editSalary ? "수정" : "등록"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>직원 선택</Form.Label>
            <SelectCombo
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              options={members.map((m) => ({
                value: m.id,
                label: `${m.name} (${m.position?.name || "무직"})`,
              }))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>급여유형</Form.Label>
            <RadioGroup
              name="salaryType"
              value={formData.salaryType}
              options={[
                { value: "POSITION", label: "직급 기준" },
                { value: "MEMBER", label: "개인 기준" },
              ]}
              onChange={handleSalaryTypeChange}
            />
          </Form.Group>

          {formData.salaryType === "POSITION" && (
            <Form.Group className="mb-3">
              <Form.Label>직급 기준급</Form.Label>
              <SelectCombo
                name="positionSalaryId"
                value={formData.positionSalaryId}
                onChange={handlePositionSalaryChange}
                options={positionSalaries.map((p) => ({
                  value: p.id,
                  label: `${p.position?.name} - ${p.baseSalary.toLocaleString()}원`,
                }))}
              />
            </Form.Group>
          )}

          {formData.salaryType === "MEMBER" && (
            <Form.Group className="mb-3">
              <Form.Label>개인 기준급</Form.Label>
              <SelectCombo
                name="memberSalaryId"
                value={formData.memberSalaryId}
                onChange={handleMemberSalaryChange}
                options={memberSalaries.map((m) => ({
                  value: m.id,
                  label: `${m.member?.name} - ${m.baseSalary.toLocaleString()}원`,
                }))}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>기본급</Form.Label>
            <Form.Control
              type="number"
              name="baseSalary"
              value={formData.baseSalary}
              onChange={handleChange}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>시급</Form.Label>
            <Form.Control
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>급여월</Form.Label>
            <Form.Control
              type="month"
              name="salaryMonth"
              value={formData.salaryMonth}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>지급일</Form.Label>
            <Form.Control
              type="date"
              name="payDate"
              value={formData.payDate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>제목</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="활성화"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            저장
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default SalaryForm;
