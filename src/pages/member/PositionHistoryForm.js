import { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import axios from "../../api/api";
import { useNavigate } from "react-router-dom";
import SelectCombo from "../../sample/SelectCombo";

export default function ChangePositionPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        memberId: "",
        newPositionId: "",
        reason: "",
    });
    const [members, setMembers] = useState([]);
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // 회원 및 직급 목록 불러오기
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [membersRes, positionsRes] = await Promise.all([
                    axios.get("/member/list"),
                    axios.get("/position/all"),
                ]);
                setMembers(membersRes.data);
                setPositions(positionsRes.data);
            } catch (err) {
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (value, field) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!form.memberId || !form.newPositionId || !form.reason) {
            setError("모든 항목을 입력해주세요.");
            return;
        }

        setSubmitting(true);
        try {
            await axios.post("/position/history/change", null, { params: form });
            setSuccess("✅ 직급 변경이 완료되었습니다!");
            setForm({ memberId: "", newPositionId: "", reason: "" });
        } catch (err) {
            setError("❌ 직급 변경 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="py-4">
            {/* 헤더 영역 */}
            <Row className="mb-3">
                <Col>
                    <h2>💼 직급 등록</h2>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="outline-secondary"
                        onClick={() => navigate(-1)}
                    >
                        목록으로
                    </Button>
                </Col>
            </Row>
            {/* 카드 영역 */}
            <Card>
                <Card.Body>
                    {/* 에러 / 성공 메시지 */}
                    {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                    {success && <Alert variant="success" className="mb-3">{success}</Alert>}

                    {loading ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <SelectCombo
                                    label="회원 선택"
                                    options={members}
                                    value={form.memberId}
                                    onChange={(v) => handleChange(v, "memberId")}
                                    searchable
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <SelectCombo
                                    label="새 직급 선택"
                                    options={positions}
                                    value={form.newPositionId}
                                    onChange={(v) => handleChange(v, "newPositionId")}
                                    searchable
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>변경 사유</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="reason"
                                    value={form.reason}
                                    onChange={(v) => handleChange(v.target.value, "reason")}
                                    rows={3}
                                    placeholder="변경 사유를 입력하세요."
                                    required
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-end gap-2">
                                <Button type="submit" variant="primary" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <Spinner size="sm" className="me-2" /> 변경 중...
                                        </>
                                    ) : (
                                        "변경"
                                    )}
                                </Button>
                                <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                                    취소
                                </Button>
                            </div>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}
