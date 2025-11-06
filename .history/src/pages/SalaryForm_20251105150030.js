import { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Table, Modal } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";

export default function SalaryManager() {
    const [show, setShow] = useState(false);
    const [members, setMembers] = useState([]);
    const [positions, setPositionSalaries] = useState([]);
    const [salaries, setSalaries] = useState([]);

    const [form, setForm] = useState({
        salaryId: "",
        memberId: "",
        positionId: "",
        salaryType: "MEMBER",
        baseSalary: 0,
        hourlyRate: 0,
        salaryMonth: "",
        netPay: 0,
    });

    // 회원, 직급 기준급, 급여 목록 로드
    useEffect(() => {
        const fetchData = async () => {
            const [membersRes, positionsRes, salariesRes] = await Promise.all([
                axios.get("/member/list"),
                axios.get("/api/position-salaries"),
                axios.get("/api/salaries")
            ]);
            setMembers(membersRes.data);
            setPositionSalaries(positionsRes.data);
            setSalaries(salariesRes.data);
        };
        fetchData();
    }, []);

    // 회원 선택 시 개인 급여 적용 또는 직급 기준 적용
    const handleMemberChange = (memberId) => {
        const member = members.find(m => m.id === Number(memberId));

        if (member?.memberSalary) {
            // 개인 급여 존재 시
            setForm({
                ...form,
                memberId,
                positionId: "",
                salaryType: "MEMBER",
                baseSalary: member.memberSalary.baseSalary,
                hourlyRate: member.memberSalary.hourlyRate,
            });
        } else if (member?.positionId) {
            // 개인 급여 없으면 직급 기준 적용
            const position = positions.find(p => p.id === member.positionId);
            setForm({
                ...form,
                memberId,
                positionId: position?.id || "",
                salaryType: "POSITION",
                baseSalary: position?.baseSalary || 0,
                hourlyRate: position?.hourlyRate || 0,
            });
        } else {
            // 개인 급여, 직급 기준 모두 없으면 초기화
            setForm({
                ...form,
                memberId,
                positionId: "",
                salaryType: "MEMBER",
                baseSalary: 0,
                hourlyRate: 0,
            });
        }
    };

    // 직급 선택 시 급여 적용
    const handlePositionChange = (positionId) => {
        const position = positions.find(p => p.id === Number(positionId));
        setForm({
            ...form,
            positionId,
            salaryType: "POSITION",
            baseSalary: position?.baseSalary || 0,
            hourlyRate: position?.hourlyRate || 0,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            salaryType: form.salaryType,
            memberId: form.salaryType === "MEMBER" ? form.memberId : null,
            positionId: form.salaryType === "POSITION" ? form.positionId : null,
            baseSalary: Number(form.baseSalary),
            hourlyRate: Number(form.hourlyRate),
            salaryMonth: form.salaryMonth,
            netPay: Number(form.netPay),
        };
        try {
            if (form.salaryId) {
                await axios.put(`/api/salaries/${form.salaryId}`, payload);
            } else {
                await axios.post("/api/salaries", payload);
            }
            alert("급여 저장 완료!");
            setShow(false);
        } catch (err) {
            console.error(err);
            alert("오류 발생!");
        }
    };

    return (
        <Container className="p-4">
            <h3>💰 급여 관리</h3>
            <Button onClick={() => setShow(true)}>+ 급여 등록</Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>회원명</th>
                        <th>유형</th>
                        <th>기본급</th>
                        <th>시급</th>
                        <th>순급여</th>
                    </tr>
                </thead>
                <tbody>
                    {salaries.map(s => (
                        <tr key={s.salaryId}>
                            <td>{s.salaryId}</td>
                            <td>{s.memberName}</td>
                            <td>{s.salaryType}</td>
                            <td>{s.baseSalary}</td>
                            <td>{s.hourlyRate}</td>
                            <td>{s.netPay}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{form.salaryId ? "급여 수정" : "급여 등록"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col>
                                <SelectCombo
                                    label="회원 선택"
                                    options={members}
                                    value={form.memberId}
                                    onChange={handleMemberChange}
                                    required
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <SelectCombo
                                    label="직급 급여 선택 (개인 기준 없을 때만)"
                                    options={positions}
                                    value={form.positionId}
                                    onChange={handlePositionChange}
                                    disabled={form.salaryType === "MEMBER"}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>기본급</Form.Label>
                                    <Form.Control value={form.baseSalary} readOnly />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>시급</Form.Label>
                                    <Form.Control value={form.hourlyRate} readOnly />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>급여월</Form.Label>
                                    <Form.Control type="month" name="salaryMonth" value={form.salaryMonth} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button type="submit">저장</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
