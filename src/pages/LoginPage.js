import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import bannerImg from "./../assets/logo192.png";

const LoginPage = () => {
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
                    <div className="d-flex gap-3 mb-3">
                        <Form style={{ width: "100%" }}>
                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group controlId="formPassword" className="mb-2">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>

                            <div
                                className="mb-4 align-items-end"
                                style={{ width: "100%", textAlign: "right", fontSize: "0.9rem" }}
                            >
                                Forgot your password?
                            </div>

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
                                Log In
                            </Button>

                            <div style={{ textAlign: "center", fontSize: "0.9rem" }}>
                                Don't have any account? <a href="#">Sign Up</a>
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
