import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "../../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import RadioGroup from "../../sample/RadioGroup";
import { EnumContext } from "../../context/EnumContext";
import { API_BASE_URL } from "../../config/config";

export default function MemberEditPage() {
    const navigate = useNavigate();
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
        positionName: "",
        profileImage: null,
        profileImageUrl: null, // 서버 이미지 URL
    });

    const [preview, setPreview] = useState(null); // 선택한 파일 미리보기
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    //폼 유효성 검사(Form Validation Check) 관련 state 정의 : 입력 양식에 문제 발생시 값을 저장할 곳
    const [errors, setErrors] = useState({
        name: '', password: '', email: '', gender: '', address: '', general: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resMember = await axios.get(`/member/info`);
                setForm(prev => ({
                    ...prev,
                    ...resMember.data,
                    password: "",
                    profileImage: null,
                    profileImageUrl: resMember.data.profileImageUrl || null,
                }));
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
            setForm(prev => ({ ...prev, profileImage: file }));

            if (file) setPreview(URL.createObjectURL(file));
            else setPreview(null);
        } else if (name === "hiredate") {
            // YYYY-MM-DD → YYYYMMDD
            setForm(prev => ({ ...prev, [name]: value.replace(/-/g, "") }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
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
                if (value !== null && value !== "") formData.append(key, value);
            });

            await axios.put("/member/update", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccess("✅ 회원 정보가 수정되었습니다!");
        } catch (err) {
            if (err.response && err.response.data) {
                // 서버에서 받은 오류 정보를 객체로 저장합니다.
                setErrors(err.response.data);
            } else { // 입력 값 이외에 발생하는 다른 오류와 관련됨.
                setErrors((previous) => ({ ...previous, general: '회원 수정 중에 오류가 발생하였습니다.' }));
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Container className="py-4">
            <Row className="mb-3">
                <Col><h2>👤 회원 수정</h2></Col>
                <Col className="text-end">
                    <Button variant="outline-secondary" onClick={() => navigate(-1)}>목록으로</Button>
                </Col>
            </Row>

            <Card>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={onSubmit}>
                        {/* 프로필 사진 */}
                        <Form.Group className="mb-3">
                            <Form.Label>프로필 사진</Form.Label>
                            <div className="d-flex align-items-center gap-3">
                                {/* 미리보기 영역 */}
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
                                            alt="미리보기"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : form.profileImageUrl ? (
                                        <img
                                            src={`${API_BASE_URL}${form.profileImageUrl}`}
                                            alt="프로필"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: 12, color: "#6c757d", textAlign: "center" }}>
                                            사진없음
                                        </span>
                                    )}
                                </div>

                                {/* 파일 선택 input */}
                                <Form.Control
                                    type="file"
                                    name="profileImage"
                                    onChange={onChange}
                                    style={{ flex: 1 }}
                                    accept="image/*"
                                />
                            </div>
                            <small className="text-muted d-block mt-1">JPG, PNG (최대 2MB)</small>
                        </Form.Group>

                        {/* 나머지 폼 */}
                        <Form.Group className="mb-3">
                            <Form.Label>아이디</Form.Label>
                            <Form.Control type="text" name="id" value={form.id} disabled />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>이름</Form.Label>
                            <Form.Control type="text" name="name" value={form.name} onChange={(e) => {
                                onChange(e);
                                setErrors(prevErrors => ({ ...prevErrors, name: "" }));  // 오류 초기화
                            }} isInvalid={!!errors.name} />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <span style={{ fontSize: "0.8em", color: "gray" }}>
                                (대문자 포함 8자리 이상, 특수 문자 '!@#$%' 중 하나 이상 포함)
                            </span>
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control type="password" name="password" value={form.password} onChange={(e) => {
                                onChange(e);
                                setErrors(prevErrors => ({ ...prevErrors, password: "" }));  // 오류 초기화
                            }} placeholder="변경 시 입력" isInvalid={!!errors.password} />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control type="text" name="email" value={form.email} onChange={(e) => {
                                onChange(e);
                                setErrors(prevErrors => ({ ...prevErrors, email: "" }));  // 오류 초기화
                            }} isInvalid={!!errors.email} />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <RadioGroup
                                label="성별"
                                options={enums?.Gender || []}
                                value={form.gender}
                                onChange={(e) => {
                                    onChange({ target: { name: "gender", value: e } })
                                    setErrors(prevErrors => ({ ...prevErrors, gender: "" }));  // 오류 초기화
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>입사일</Form.Label>
                            <Form.Control
                                type="date"
                                name="hiredate"
                                value={form.hiredate ? `${form.hiredate.slice(0, 4)}-${form.hiredate.slice(4, 6)}-${form.hiredate.slice(6, 8)}` : ""}
                                onChange={onChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>주소</Form.Label>
                            <Form.Control type="text" name="address" value={form.address} onChange={(e) => {
                                onChange(e);
                                setErrors(prevErrors => ({ ...prevErrors, address: "" }));  // 오류 초기화
                            }} isInvalid={!!errors.address} />
                            <Form.Control.Feedback type="invalid">
                                {errors.address}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>직급</Form.Label>
                            <Form.Control type="text" name="positionName" value={form.positionName ?? ''} disabled />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button type="submit" variant="primary" disabled={submitting}>
                                {submitting ? <><Spinner size="sm" className="me-2" /> 수정 중...</> : "수정"}
                            </Button>
                            <Button variant="outline-secondary" onClick={() => navigate(/)}>취소</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
