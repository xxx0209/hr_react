import React from "react";
import { Nav, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

export default function MemberSubMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <Row className="mb-3">
                <Col xs={12}>
                    <Button
                        variant="primary"
                        size="sm"
                        className="w-100"
                        onClick={() => navigate("/board/create")}
                    >
                        ✏️ 글쓰기
                    </Button>
                </Col>
            </Row>

            <Nav className="flex-column">
                <Nav.Link
                    onClick={() => navigate('/member/samplePage')}
                    active={location.pathname === '/member/samplePage'}
                >
                    샘플테스트 페이지
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/login')}
                    active={location.pathname === '/login'}
                >
                    로그인 테스트
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/member/schedule')}
                    active={location.pathname === '/member/schedule'}
                >
                    스케쥴 테스트
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/signup')}
                    active={location.pathname === '/signup'}
                >
                    회원가입 테스트
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/member/position')}
                    active={location.pathname === '/member/position'}
                >
                    직급등록 테스트
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/member/position/list')}
                    active={location.pathname === '/member/position/list'}
                >
                    직급 리스트 테스트
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/member/position/history/list')}
                    active={location.pathname === '/member/position/history/list'}
                >
                    직급내역 리스트 테스트
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/member/position/history/save')}
                    active={location.pathname === '/member/position/history/save'}
                >
                    직급내역 등록 테스트
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/member/category')}
                    active={location.pathname === '/member/category'}
                >
                    카테고리 등록 테스트
                </Nav.Link>
            </Nav>

        </>
    );
}