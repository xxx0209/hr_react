import React from "react";
import { Nav, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

export default function BoardSubMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <Nav className="flex-column">
                {/* <Nav className="flex-column border-start ps-3"> */}
                    <Nav.Link
                        onClick={() => navigate('/approval/status')}
                        active={location.pathname === '/approval/status'}
                    >
                        📄 결재 현황
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/approval/request')}
                        active={location.pathname === '/approval/request'}
                    >
                        📝 기안 작성
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/approval/temp')}
                        active={location.pathname === '/approval/temp'}
                    >
                        📂 임시 보관함
                    </Nav.Link>
                {/* </Nav> */}
            </Nav>

        </>
    );
}