// Layout.js
import React from "react";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import MenuItems from "../ui/MenuItems";

function Layout({ children }) {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column vh-100">
            {/* 상단 */}
            <Navbar bg="light" className="border-bottom">
                <Container className="d-flex justify-content-between">
                    <Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
                        🔵 여기다가 나중에 로고 넣기
                    </Navbar.Brand>
                    <div>
                        <strong>여기는 사용자 이름</strong><br />
                        <small>user@example.com</small>
                    </div>
                </Container>
            </Navbar>

            {/* 본문 */}
            <Container fluid className="flex-grow-1">
                <Row className="h-100">
                    {/* 왼쪽 사이드 메뉴 */}
                    <Col md={3} className="border-end p-3" style={{ height: '100%' }}>
                        <div className="d-flex h-100">
                            <MenuItems />
                        </div>
                    </Col>

                    {/* 오른쪽 콘텐츠 */}
                    <Col md={9} className="p-4" style={{ overflowY: 'auto' }}>
                        {children}
                    </Col>
                </Row>
            </Container>

            {/* 푸터 */}
            <footer className="bg-dark text-white text-center py-3 mt-auto">
                ⓒ 2025 MyCompany. All rights reserved.
            </footer>
        </div>
    );
}

export default Layout;
