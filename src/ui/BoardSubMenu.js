import React from "react";
import { Nav, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

export default function BoardSubMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <Nav className="flex-column">
                <Nav.Link
                    onClick={() => navigate('/board/notice')}
                    active={location.pathname === '/board/notice'}
                >
                    📢 공지사항
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/board/free')}
                    active={location.pathname === '/board/free'}
                >
                    💬 자유게시판
                </Nav.Link>
            </Nav>

        </>
    );
}