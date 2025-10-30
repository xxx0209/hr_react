import React from "react";
import { Nav, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

export default function BoardSubMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
           
            <Nav className="flex-column">  
                {/* < {<Nav className="flex-column border-start ps-3"> */}
                    <Nav.Link
                        onClick={() => navigate('/salary/my-salaries')}
                        active={location.pathname === '/salary/my-salaries'}
                    >
                        📋 나의 급여 내역
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/salary/salaries')}
                        active={location.pathname === '/salary/salaries'}
                    >
                        🧾 전체 급여 목록 (관리자)
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/salary/salaries/new')}
                        active={location.pathname === '/salary/salaries/new'}
                    >
                        ➕ 급여 생성
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/salary/salaries/pending')}
                        active={location.pathname === '/salary/salaries/pending'}
                    >
                        ⏳ 승인 대기 급여
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/salary/base-salary')}
                        active={location.pathname === '/salary/base-salary'}
                    >
                        ⚙️ 기본급 설정
                    </Nav.Link>
                </Nav>

        </>
    );
}