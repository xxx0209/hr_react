import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
// 상태 변수 설정
    // 테스트ㅡ트트트
    return (
        // <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Container className="d-flex justify-content-center align-items-center">
            <Row>
                <Col>
                    <Card style={{ width: '24rem' }}>
                        <Card.Body>
                            <Card.Title className="text-center mb-4">🔐 로그인</Card.Title>
                            {/* <Form onSubmit={handleLogin}> */}
                            <Form>
                                <Form.Group controlId="formEmail" className="mb-3">
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="이메일 입력"
                                        // value={email}
                                        // onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword" className="mb-4">
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="비밀번호 입력"
                                        // value={password}
                                        // onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button variant="primary" type="submit">
                                        로그인
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container >
    );

}

export default LoginPage;