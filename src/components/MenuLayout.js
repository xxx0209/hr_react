import React, { useState } from "react";
import { Row, Col, Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import MemberSubMenu from "../ui/MemberSubMenu";
import ApprovalSubMenu from "../ui/ApprovalSubMenu";
// 하위 메뉴 컴포넌트 import
// import ApprovalSubMenu from "./ApprovalSubMenu";
// import BoardSubMenu from "./BoardSubMenu";
import SalarySubMenu from "../ui/SalarySubMenu";

export default function MenuItems() {
    const navigate = useNavigate();
    const location = useLocation();

    // 현재 활성화된 대분류
    const [activeMenu, setActiveMenu] = useState(null);

    // 대분류 메뉴 클릭 시
    const handleSelect = (menuKey, path) => {
        // 같은 메뉴 클릭 시 토글 효과
        setActiveMenu(activeMenu === menuKey ? null : menuKey);

        if (path) {
            navigate(path);
        }
    };

    return (
        <Row className="flex-grow-1 w-100">
            {/* 왼쪽: 대분류 */}
            <Col md={5} className="border-end pe-0">
                <Nav className="flex-column">
                    <Nav.Link
                        onClick={() => handleSelect("home", "/home")}
                        active={location.pathname.startsWith("/home")}
                    >
                        🏠 홈
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => handleSelect("member", "/member/samplePage")}
                        active={location.pathname.startsWith("/member")} // 선택활성화
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
                        onClick={() => handleSelect("board", "/board")}
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
                </Nav>
            </Col>

            {/* 오른쪽: 소분류 */}
            <Col md={7} className="ps-3">
                {activeMenu === "member" && <MemberSubMenu />}
                {activeMenu === "approval" && <ApprovalSubMenu />}
                {activeMenu === "salary" && <SalarySubMenu />}

                {!activeMenu && (
                    <div className="text-muted mt-3">
                        ⬅️ 왼쪽 메뉴를 선택하면 하위 메뉴가 표시됩니다.
                    </div>
                )}
            </Col>
        </Row>
    );
}