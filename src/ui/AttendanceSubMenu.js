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
                    onClick={() => navigate('/attendance/attendance')}
                    active={location.pathname.includes('/attendance')}
                >
                    출퇴근 기능 테스트
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/attendance/leave')}
                    active={location.pathname === '/attendance/leave'}
                >
                    휴가 현황 테스트
                </Nav.Link>
            </Nav>

        </>
    );
}