import React, { useState } from "react";
import { Nav, Col, Row } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import MemberSubMenu from "../ui/MemberSubMenu";
import BoardSubMenu from "../ui/BoardSubMenu";
import ApprovalSubMenu from "../ui/ApprovalSubMenu";
import AttendanceSubMenu from "../ui/AttendanceSubMenu";
import SalarySubMenu from "../ui/SalarySubMenu";

export default function MenuLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState("home");

    const handleSelect = (menuKey, path) => {
        setActiveMenu(menuKey);
        if (path) navigate(path);
    };

    const showSubMenu = ["member", "attendance", "board", "approval", "salary"].includes(activeMenu);

    return (
        <Row className="flex-grow-1 w-100 h-100">
            {/* 왼쪽: 대분류 메뉴만 항상 표시 */}
            <Col md={showSubMenu ? 5 : 12} className="border-end pe-0">
                <Nav className="flex-column p-2">
                    <Nav.Link
                        onClick={() => handleSelect("home", "/home")}
                        active={location.pathname.startsWith("/home")}
                    >
                        🏠 홈
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => handleSelect("member", "/member/samplePage")}
                        active={location.pathname.startsWith("/member")}
                    >
                        🧾 회원관리
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => handleSelect("approval", "/approval/status")}
                        active={location.pathname.startsWith("/approval")}
                    >
                        🧾 전자결재
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => handleSelect("board", "/board/notice")}
                        active={location.pathname.startsWith("/board")}
                    >
                        🗂 게시판
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => handleSelect("salary", "/salary/salary")}
                        active={location.pathname.startsWith("/salary")}
                    >
                        💰 급여관리
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => handleSelect("attendance", "/attendance/attendance")}
                        active={location.pathname.startsWith("/attendance")}
                    >
                        🧑‍💼 출퇴근 기능
                    </Nav.Link>
                </Nav>
            </Col>

            {/* 오른쪽: 하위 메뉴는 Home일 때 렌더링하지 않음 */}
            {showSubMenu && (
                <Col md={7} className="ps-3">
                    {activeMenu === "member" && <MemberSubMenu />}
                    {activeMenu === "attendance" && <AttendanceSubMenu />}
                    {activeMenu === "board" && <BoardSubMenu />}
                    {activeMenu === "approval" && <ApprovalSubMenu />}
                    {activeMenu === "salary" && <SalarySubMenu />}
                </Col>
            )}
        </Row>
    );
}
