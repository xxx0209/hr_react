import { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert,
    Spinner,
    InputGroup
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/api";
import RadioGroup from "../../sample/RadioGroup";

export default function PositionDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        positionCode: "",
        positionName: "",
        description: "",
        active: true
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({
        positionName: "",
        description: ""
    });

    useEffect(() => {
        axios
            .get(`/position/${id}`)
            .then((res) => {
                setForm(res.data);
            })
            .catch(() => {
                alert("데이터를 불러오는 중 오류가 발생했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage("");

        try {
            if (!window.confirm("수정 하시겠습니까?")) return;
            await axios.put(`/position/${id}`, form);
            setMessage({ type: "success", text: "✅ 수정이 완료되었습니다!" });
        } catch (err) {
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                setMessage({ type: "danger", text: "❌ 수정 중 오류가 발생했습니다." });
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-4">로딩중...</div>;

    return (
        <Container className="py-4">

            {/* 헤더 */}
            <Row className="mb-3">
                <Col>
                    <h2>💼 직급관리 상세 / 수정</h2>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="outline-secondary"
                        onClick={() => navigate("/member/position/list")}
                    >
                        목록으로
                    </Button>
                </Col>
            </Row>

            <Card>
                <Card.Body>

                    {/* 메시지 출력 */}
                    {message && (
                        <Alert variant={message.type} className="mb-3">
                            {message.text}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>

                        {/* 직급 코드 - 수정 불가 */}
                        <Form.Group className="mb-3">
                            <Form.Label>직급 코드</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    value={form.positionCode}
                                    disabled
                                />
                            </InputGroup>
                        </Form.Group>

                        {/* 직급 이름 */}
                        <Form.Group className="mb-3">
                            <Form.Label>직급 이름</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    name="positionName"
                                    value={form.positionName}
                                    onChange={handleChange}
                                    maxLength={50}
                                    isInvalid={!!errors.positionName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.positionName}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        {/* 설명 */}
                        <Form.Group className="mb-4">
                            <Form.Label>설명</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={5}
                                    isInvalid={!!errors.description}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.description}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        {/* 활성 여부 */}
                        <Form.Group className="mb-3">
                            <RadioGroup
                                label="활성 여부"
                                options={[
                                    { label: "활성", value: true },
                                    { label: "비활성", value: false }
                                ]}
                                value={form.active}
                                onChange={(v) => setForm((prev) => ({ ...prev, active: v }))}
                            />
                        </Form.Group>

                        {/* 버튼 영역 */}
                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Spinner size="sm" className="me-2" /> 수정 중...
                                    </>
                                ) : (
                                    "수정"
                                )}
                            </Button>
                        </div>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
