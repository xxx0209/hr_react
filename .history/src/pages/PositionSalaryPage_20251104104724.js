import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";

const SALARY_API = "http://localhost:8080/api/position-salaries";
const POSITION_API = "http://localhost:8080/api/positions";

function PositionSalaryPage() {
    const [salaries, setSalaries] = useState([]);
    const [positions, setPositions] = useState([]);
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        positionId: "",
        title
        baseSalary: "",
        hourlyRate: ""
    });

    // 데이터 로드
    const fetchData = async () => {
        // const [salaryRes, posRes] = await Promise.all([
        // //   axios.get(SALARY_API),
        // //   axios.get(POSITION_API)
        //      axios.get('/position/all')
        // ]);
        const [posRes] = await Promise.all([
            //   axios.get(SALARY_API),
            //   axios.get(POSITION_API)
            axios.get('/position/all')
        ]);
        // setSalaries(salaryRes.data);
        setPositions(posRes.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleShow = () => {
        setFormData({ positionId: "", baseSalary: "", hourlyRate: "" });
        setShow(true);
    };

    const handleSave = async () => {
        if (!formData.positionId) {
            alert("직급을 선택해주세요!");
            return;
        }
        await axios.post('/api/position-salaries', formData);
        setShow(false);
        fetchData();
    };

    const handleDelete = async (id) => {
        if (window.confirm("삭제하시겠습니까?")) {
            await axios.delete(`${SALARY_API}/${id}`);
            fetchData();
        }
    };

    return (
        <div className="container mt-4">
            <h3>직위별 급여 관리</h3>
            <Button className="mb-3" onClick={handleShow}>+ 급여 등록</Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>직급명</th>
                        <th>기본급</th>
                        <th>시급</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {salaries.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.title}</td>
                            <td>{s.baseSalary}</td>
                            <td>{s.hourlyRate}</td>
                            <td>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>삭제</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* 등록 모달 */}
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>급여 등록</Modal.Title>
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
                                required
                                placeholder={'직급 선택'}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>기본급</Form.Label>
                            <Form.Control
                                type="string"
                                placeholder="제목 입력"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>기본급</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="기본급 입력"
                                value={formData.baseSalary}
                                onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>시급</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="시급 입력"
                                value={formData.hourlyRate}
                                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>닫기</Button>
                    <Button variant="primary" onClick={handleSave}>등록</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PositionSalaryPage;