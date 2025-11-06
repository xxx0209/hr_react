import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";
import RadioGroup from "../sample/RadioGroup";

function PositionSalaryPage() {
    const [salaries, setSalaries] = useState([]);
    const [positions, setPositions] = useState([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState(false); // 수정 모드 여부
    const [formData, setFormData] = useState({
        positionId: "",
        positionName: "",
        title: "",
        baseSalary: "",
        hourlyRate: "",
        active: ""
    });

    // 데이터 로드
    const fetchData = async () => {
        // const [salaryRes, posRes] = await Promise.all([
        // //   axios.get(SALARY_API),
        // //   axios.get(POSITION_API)
        //      axios.get('/position/all')
        // ]);
        const [posRes, salaryRes] = await Promise.all([
            //   axios.get(SALARY_API),
            axios.get('/position/all'),
            axios.get('/api/position-salaries')
        ]);
        setSalaries(salaryRes.data);
        setPositions(posRes.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    /** 등록/수정 모달 오픈 */
    const handleShow = (salary = null) => {
        if (salary) {
            // 수정 모드
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
            // 등록 모드
            setEditing(false);
            setFormData({
                id: "",
                title: "",
                positionId: "",
                baseSalary: "",
                hourlyRate: "",
                active: ""
            });
        }
        setShow(true);
    };

    /** 등록 or 수정 저장 */
    const handleSave = async () => {
        if (!formData.positionId) {
            alert("직급을 선택해주세요!");
            return;
        }

        const payload = {
            positionId: formData.positionId,
            baseSalary: formData.baseSalary,
            hourlyRate: formData.hourlyRate
        };

        if (editing) {
            await axios.put(`/api/position-salaries/${formData.id}`, payload);
        } else {
            await axios.post('/api/position-salaries', payload);
        }

        try {

            const response
            
            if (editing) {
                const response = await axios.put(`/api/position-salaries/${formData.id}`, payload);
            } else {
                const response = await axios.post('/api/position-salaries', payload);
            }           

            if (response.status === 200) { // 스프링의 MemberController 파일 참조
                alert("회원가입이 완료되었습니다!");
                navigate('/login');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                // 서버에서 받은 오류 정보를 객체로 저장합니다.
                setErrors(error.response.data);
            } else { // 입력 값 이외에 발생하는 다른 오류와 관련됨.
                setErrors((previous) => ({ ...previous, general: '회원 가입 중에 오류가 발생하였습니다.' }));
            }
        }

        setShow(false);
        fetchData();
    };

    const handleDelete = async (id) => {
        if (window.confirm("삭제하시겠습니까?")) {
            await axios.delete(`/api/position-salaries/${id}`);
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
                        <th>제목</th>
                        <th>기본급</th>
                        <th>시급</th>
                        <th>관리</th>
                        <th>활성</th>
                    </tr>
                </thead>
                <tbody>
                    {salaries.map((s) => (
                        <tr key={s.positionId}>
                            <td>{s.positionId}</td>
                            <td>{s.positionName}</td>
                            <td>{s.title}</td>
                            <td>{s.baseSalary}</td>
                            <td>{s.hourlyRate}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleShow(s)}
                                    className="me-2"
                                >
                                    수정
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(s.positionId)}>삭제</Button>
                            </td>
                            <td>{s.active ? "Y" : "N"}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* 등록/수정 모달 */}
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editing ? "급여 수정" : "급여 등록"}
                    </Modal.Title>
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
                            <Form.Label>제목</Form.Label>
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
                        <RadioGroup
                            label="활성"
                            options={[{ label: '활성', value: true }, { label: '비활성', value: false }]}
                            value={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e })}
                        />

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

export default PositionSalaryPage;