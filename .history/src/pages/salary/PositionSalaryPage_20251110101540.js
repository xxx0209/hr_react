import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "../../api/api";
import SelectCombo from "../../sample/SelectCombo";
import RadioGroup from "../../sample/RadioGroup";

function PositionSalaryPage() {
  const [salaries, setSalaries] = useState([]);
  const [positions, setPositions] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    positionId: "",
    title: "",
    baseSalary: "",
    hourlyRate: "",
    active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [posRes, salaryRes] = await Promise.all([
        axios.get('/position/all'), // 백엔드 URL 확인 필요
        axios.get('/api/position-salaries')
      ]);

      // SelectCombo용 변환 (value/label)
      setPositions(posRes.data.map(p => ({
        value: p.positionId,
        label: p.positionName
      })));

      setSalaries(salaryRes.data);
    } catch (err) {
      console.error(err);
      alert("직급/급여 데이터를 불러오는 중 오류 발생");
    }
  };

  const handleShow = (salary = null) => {
    if (salary) {
      setEditing(true);
      setFormData({
        id: salary.id,
        positionId: salary.positionId,
        title: salary.title,
        baseSalary: salary.baseSalary,
        hourlyRate: salary.hourlyRate,
        active: salary.active
      });
    } else {
      setEditing(false);
      setFormData({
        id: "",
        positionId: "",
        title: "",
        baseSalary: "",
        hourlyRate: "",
        active: true
      });
    }
    setShow(true);
  };

  const handleSave = async () => {
    if (!formData.positionId) {
      alert("직급을 선택해주세요!");
      return;
    }

    const payload = {
      positionId: formData.positionId,
      title: formData.title,
      baseSalary: formData.baseSalary,
      hourlyRate: formData.hourlyRate,
      active: formData.active
    };

    try {
      if (editing) {
        await axios.put(`/api/position-salaries/${formData.id}`, payload);
      } else {
        await axios.post('/api/position-salaries', payload);
      }
      alert("등록/수정 되었습니다.");
      fetchData();
      setShow(false);
    } catch (error) {
      console.error(error);
      alert("오류가 발생하였습니다. " + error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/position-salaries/${id}`);
        fetchData();
      } catch (error) {
        console.error(error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="container mt-4">
      <h3>직위별 급여 관리</h3>
      <Button className="mb-3" onClick={() => handleShow()}>
        + 급여 등록
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>직급명</th>
            <th>제목</th>
            <th>기본급</th>
            <th>시급</th>
            <th>관리</th>
            <th>활성</th>
          </tr>
        </thead>
        <tbody>
          {salaries.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">데이터가 없습니다</td>
            </tr>
          ) : (
            salaries.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.positionName}</td>
                <td>{s.title}</td>
                <td>{formatNumber(s.baseSalary)}원</td>
                <td>{formatNumber(s.hourlyRate)}원</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleShow(s)}
                    className="me-2"
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
                <td>{s.active ? "Y" : "N"}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* 등록/수정 모달 */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "급여 수정" : "급여 등록"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>직급 선택</Form.Label>
              <SelectCombo
                options={positions}
                value={formData.positionId}
                onChange={v => setFormData({ ...formData, positionId: v })}
                searchable
                placeholder="직급 선택"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>제목</Form.Label>
              <Form.Control
                type="text"
                placeholder="제목 입력"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>기본급</Form.Label>
              <Form.Control
                type="text"
                value={formatNumber(formData.baseSalary)}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, '');
                  if (!isNaN(rawValue)) {
                    setFormData({ ...formData, baseSalary: rawValue });
                  }
                }}
                placeholder="기본급 입력 (원)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>시급</Form.Label>
              <Form.Control
                type="text"
                value={formatNumber(formData.hourlyRate)}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, '');
                  if (!isNaN(rawValue)) {
                    setFormData({ ...formData, hourlyRate: rawValue });
                  }
                }}
                placeholder="시급 입력 (원)"
              />
            </Form.Group>

            <RadioGroup
              label="활성"
              options={[
                { label: '활성', value: true },
                { label: '비활성', value: false }
              ]}
              value={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e })}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>닫기</Button>
          <Button variant="primary" onClick={handleSave}>
            {editing ? "수정 저장" : "등록"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PositionSalaryPage;
