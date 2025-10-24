import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, InputGroup } from "react-bootstrap";
import bannerImg from "./../assets/logo192.png";
import { API_BASE_URL } from "../config/config";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {

    const navigate = useNavigate();

    //폼 데이터 state 정의
    const [formData, setFormData] = useState({
        memberId: "",
        password: "",
    });

    //폼 유효성 검사(Form Validation Check) 관련 state 정의 : 입력 양식에 문제 발생시 값을 저장할 곳
    const [errors, setErrors] = useState({
        memberId: '', password: '', general: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.memberId.trim() === "") {
            setErrors(prevErrors => ({
                ...prevErrors,
                memberId: "아이디를 입력해 주세요."
            }));
            return;
        }

        if (formData.password.trim() === "") {
            setErrors(prevErrors => ({
                ...prevErrors,
                password: "비밀번호를 입력해 주세요."
            }));
            return;
        }

        const url = `${API_BASE_URL}/member/login`;
        const parameters = formData;

        try {

            const response = await axios.post(url, parameters);

            if (response.status === 200) { // 스프링의 MemberController 파일 참조

                const token = response.data.token;

                // JWT 토큰 저장 (실무에선 httpOnly cookie 권장)
                localStorage.setItem('accessToken', token);

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
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
        >

            {/* 로그인 박스 */}
            <Row
                style={{
                    width: "800px",
                    minHeight: "500px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                }}
            >
                {/* 왼쪽 칸: 로그인 폼 */}
                <Col
                    md={6}
                    className="d-flex flex-column justify-content-center align-items-center p-4"
                    style={{
                        borderRight: "1px solid #ddd",
                    }}
                >

                    <h2 style={{ marginBottom: "30px" }}>Log in</h2>
                    <div className="d-flex w-100 gap-3 mb-3 ">
                        {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                        <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                            <Form.Group controlId="formMemberId" className="mb-3">
                                <Form.Label>아이디</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="아이디"
                                        value={formData.memberId}
                                        onChange={(e) => {
                                            setFormData({ ...formData, memberId: e.target.value });
                                            setErrors(prevErrors => ({ ...prevErrors, memberId: "" }));  // 오류 초기화
                                        }}
                                        isInvalid={!!errors.memberId}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.memberId}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formPassword" className="mb-2">
                                <Form.Label>비밀번호</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="password"
                                        placeholder="비밀번호"
                                        value={formData.password}
                                        onChange={(e) => {
                                            setFormData({ ...formData, password: e.target.value });
                                            setErrors(prevErrors => ({ ...prevErrors, password: "" }));  // 오류 초기화
                                        }}
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <div
                                className="mb-4 align-items-end"
                                style={{ width: "100%", textAlign: "right", fontSize: "0.9rem" }}
                            >
                                비밀번호를 잊으셨나요?
                            </div>
                            {errors.password && (
                                <div className="text-danger mt-1" style={{ fontSize: "0.9rem" }}>
                                    {errors.password}
                                </div>
                            )}
                            <Button
                                variant="primary"
                                type="submit"
                                style={{
                                    width: "100%",
                                    backgroundColor: "#007bff",
                                    borderColor: "#007bff",
                                    marginBottom: "15px",
                                }}
                            >
                                로그인
                            </Button>

                            <div style={{ textAlign: "center", fontSize: "0.9rem" }}>
                                회원이 아니신가요? <a href="#">회원가입</a>
                            </div>
                        </Form>
                    </div>
                </Col>

                {/* 오른쪽 칸: 배너 이미지 */}
                <Col
                    md={6}
                    className="d-flex justify-content-center align-items-center p-4"
                    style={{ backgroundColor: "#f8f9fa" }}
                >
                    <img
                        src={bannerImg}
                        alt="Banner"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            borderRadius: "10px",
                        }}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
