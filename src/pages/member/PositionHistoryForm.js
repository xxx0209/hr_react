import { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "../../api/api";
import SelectCombo from "../../sample/SelectCombo";

export default function ChangePositionPage() {
    const [form, setForm] = useState({
        memberId: "",
        newPositionId: "",
        reason: "",
    });
    const [members, setMembers] = useState([]);
    const [positions, setPositions] = useState([]);

    // 회원 및 직급 목록 불러오기
    useEffect(() => {
        const fetchData = async () => {
            const [membersRes, positionsRes] = await Promise.all([
                axios.get("/member/list"),
                axios.get("/position/all"),
            ]);
            setMembers(membersRes.data);
            setPositions(positionsRes.data);
        };
        fetchData();
    }, []);

    const handleChange = (e, filed) => {
        setForm({ ...form, [filed]: e });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("/position/history/change", null, { params: form });
        alert("직급 변경 완료!");
    };

    return (
        <Container className="p-4" style={{ maxWidth: "600px" }}>
            <h3 className="mb-4 fw-bold">회원 직급 변경</h3>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <SelectCombo
                                label="회원 선택"
                                options={members}
                                value={form.memberId}
                                onChange={(v) => handleChange(v, 'memberId')}
                                searchable={true}
                                required={true}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <SelectCombo
                                label="새 직급 선택"
                                options={positions}
                                value={form.newPositionId}
                                onChange={(v) => handleChange(v, 'newPositionId')}
                                searchable={true}
                                required={true}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>변경 사유</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="reason"
                        value={form.reason}
                        onChange={(v) => handleChange(v.target.value, 'reason')}
                        rows={3}
                        required
                    />
                </Form.Group>

                <Button type="submit">변경</Button>
            </Form>
        </Container>
    );
}