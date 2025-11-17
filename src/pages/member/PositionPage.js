// PositionRegisterPage.jsx
import { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../../api/api";
import { EnumContext } from "../../context/EnumContext";

export default function PositionRegisterPage() {
    const navigate = useNavigate();
    const enums = useContext(EnumContext);

    const [form, setForm] = useState({
        positionCode: "",
        positionName: "",
        description: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [errors, setErrors] = useState({
        id: '', positionCode: '', positionName: '', description: ''
    });

    // 로그인 체크 (선택 사항)
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login");
        }
    }, [navigate]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        //if (!form.positionCode.trim()) return "직급 코드를 입력하세요.";
        //if (!form.positionName.trim()) return "직급 이름을 입력하세요.";
        //if (!form.description.trim()) return "설명을 입력하세요.";
        return "";
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const msg = validate();
        if (msg) return setError(msg);

        setSubmitting(true);
        try {
            if (!window.confirm("등록 하시겠습니까?")) return;
            await axios.post("/position/save", form, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            setSuccess("✅ 직급 등록이 완료되었습니다!");
            setForm({ positionCode: "", positionName: "", description: "" });
        } catch (err) {
            if (err.response && err.response.data) {
                // 서버에서 받은 오류 정보를 객체로 저장합니다.
                setErrors(err.response.data);
            } else { // 입력 값 이외에 발생하는 다른 오류와 관련됨.
                const apiMsg =
                    err.response?.data?.message ||
                    err.message ||
                    "❌ 등록 중 오류가 발생했습니다.";
                setError(apiMsg);
            }

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="py-4">
            {/* 헤더 영역 */}
            <Row className="mb-3">
                <Col>
                    <h2>💼 직급관리 등록</h2>
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

            {/* 카드 영역 */}
            <Card>
                <Card.Body>
                    {/* 에러 / 성공 메시지 */}
                    {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                    {success && <Alert variant="success" className="mb-3">{success}</Alert>}

                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>직급 코드 (영문, UNIQUE)</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    name="positionCode"
                                    value={form.positionCode}
                                    onChange={(e) => {
                                        onChange(e);
                                        setErrors(prevErrors => ({ ...prevErrors, positionCode: "" }));  // 오류 초기화
                                    }}
                                    placeholder="예: INTERN, STAFF"
                                    maxLength={50}
                                    isInvalid={!!errors.positionCode}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.positionCode}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>직급 이름 (화면 표시용)</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    name="positionName"
                                    value={form.positionName}
                                    onChange={(e) => {
                                        onChange(e);
                                        setErrors(prevErrors => ({ ...prevErrors, positionName: "" }));  // 오류 초기화
                                    }}
                                    placeholder="예: 인턴, 직원"
                                    maxLength={50}
                                    isInvalid={!!errors.positionName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.positionName}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>설명</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={form.description}
                                    onChange={(e) => {
                                        onChange(e);
                                        setErrors(prevErrors => ({ ...prevErrors, description: "" }));  // 오류 초기화
                                    }}
                                    placeholder="직급에 대한 설명을 입력하세요"
                                    rows={5}
                                    isInvalid={!!errors.description}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.description}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Spinner size="sm" className="me-2" /> 등록 중...
                                    </>
                                ) : (
                                    "등록"
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
