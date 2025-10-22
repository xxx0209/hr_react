// Layout.js
import React from "react";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="d-flex flex-column vh-100">
            {/* 상단 */}
            <Navbar bg="light" className="border-bottom">
                <Container className="d-flex justify-content-between">
                    <Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
                        🔵 MyCompany
                    </Navbar.Brand>
                    <div>
                        <strong>홍길동</strong><br />
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
                            {/* 첫 번째 메뉴 그룹 */}
                            <Nav className="flex-column me-3">
                                <Nav.Link
                                    onClick={() => navigate('/home')}
                                    active={location.pathname === '/home'}
                                >
                                    홈
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => navigate('/profile')}
                                    active={location.pathname === '/profile'}
                                >
                                    전자결제
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => navigate('/settings')}
                                    active={location.pathname === '/settings'}
                                >
                                    캘린더
                                </Nav.Link>
                            </Nav>

                            {/* 두 번째 메뉴 그룹 */}
                            <Nav className="flex-column border-start ps-3">
                                <Nav.Link
                                    onClick={() => navigate('/help')}
                                    active={location.pathname === '/help'}
                                >
                                    여기메뉴1
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => navigate('/faq')}
                                    active={location.pathname === '/faq'}
                                >
                                    여기메뉴2
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => navigate('/terms')}
                                    active={location.pathname === '/terms'}
                                >
                                    여기메뉴3
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => navigate('/terms')}
                                    active={location.pathname === '/terms'}
                                >
                                    여기메뉴4
                                </Nav.Link>
                            </Nav>
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
