import React from "react";
import { Nav, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

export default function BoardSubMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <Row className="mb-3">
                <Col xs={12}>
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-100"
                        onClick={() => navigate("/board/write")}
                    >
                        ✏️ 글쓰기
                    </Button>
                </Col>
            </Row>

            <Nav className="flex-column">
                <Nav.Link
                    onClick={() => navigate('/board/notice')}
                    active={location.pathname === '/board/notice'}
                >
                    공지사항
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/board/free')}
                    active={location.pathname === '/board/free'}
                >
                    자유게시판
                </Nav.Link>
            </Nav>

        </>
    );
}