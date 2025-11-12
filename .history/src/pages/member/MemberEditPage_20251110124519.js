import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import RadioGroup from "../../sample/RadioGroup";
import { EnumContext } from "../../context/EnumContext";

export default function MemberEditPage() {
    const navigate = useNavigate();

    const [preview, setPreview] = useState(null);


    const enums = useContext(EnumContext);

    const { user } = useContext(AuthContext);

    const [form, setForm] = useState({
        id: user.memberId,
        name: "",
        password: "",
        email: "",
        gender: "",
        hiredate: "",
        address: "",
        positionId: "",
        profileImage: null,
    });

    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resMember = await axios.get(`/member/info`);
                setForm({ ...resMember.data, password: "", profileImage: null });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const onChange = (e) => {
        const { name, value, files } = e?.target || e;
        if (name === "profileImage") {
            const file = files[0];
            setForm((prev) => ({ ...prev, profileImage: file }));

            // 미리보기 생성
            if (file) {
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);
            } else {
                setPreview(null);
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value !== null && value !== "") {
                    formData.append(key, value);
                }
            });

            await axios.put("/members/update", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccess("✅ 회원 정보가 수정되었습니다!");
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Container className="py-4">
            <Row className="mb-3">
                <Col>
                    <h2>👤 회원 수정</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="outline-secondary" onClick={() => navigate(-1)}>목록으로</Button>
                </Col>
            </Row>

            <Card>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>프로필 사진</Form.Label>
                        <div className="d-flex align-items-center gap-3">
                            {/* 미리보기 이미지 */}
                            <div
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: "2px solid #ced4da",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#f8f9fa",
                                }}
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="프로필 미리보기"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <span style={{ color: "#6c757d", fontSize: 12, textAlign: "center" }}>
                                        사진 없음
                                    </span>
                                )}
                            </div>

                            {/* 파일 input */}
                            <Form.Control
                                type="file"
                                name="profileImage"
                                onChange={onChange}
                                style={{ flex: 1 }} // 남은 공간 꽉 채움
                                accept="image/*"
                            />
                        </div>
                        <small className="text-muted d-block mt-1">JPG, PNG (최대 2MB)</small>
                    </Form.Group>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>아이디</Form.Label>
                            <Form.Control type="text" name="id" value={form.id} disabled />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>이름</Form.Label>
                            <Form.Control type="text" name="name" value={form.name} onChange={onChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control type="password" name="password" value={form.password} onChange={onChange} placeholder="변경 시 입력" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control type="email" name="email" value={form.email} onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <RadioGroup
                                label="성별"
                                options={enums?.Gender || []}
                                value={form.gender}
                                onChange={(val) => onChange({ target: { name: "gender", value: val } })}

                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>입사일</Form.Label>
                            <Form.Control type="date" name="hiredate" value={form.hiredate} onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>주소</Form.Label>
                            <Form.Control type="text" name="address" value={form.address} onChange={onChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>직급</Form.Label>
                            <Form.Control type="text" name="positionName" value={form.positionName} disabled />
                            
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button type="submit" variant="primary" disabled={submitting}>
                                {submitting ? <><Spinner size="sm" className="me-2" /> 수정 중...</> : "수정"}
                            </Button>
                            <Button variant="outline-secondary" onClick={() => navigate(-1)}>취소</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}