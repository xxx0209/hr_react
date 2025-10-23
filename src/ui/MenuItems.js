import { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

// useNavigate 훅은 특정한 페이지로 이동하고자 할 때 사용되는 훅입니다.
import { useLocation, useNavigate } from "react-router-dom";

function App() {

    const navigate = useNavigate();
    const location = useLocation();

    // 전자결재 메뉴 활성화 여부 체크
    const [isApprovalMode, setIsApprovalMode] = useState(false);

    // 메뉴 클릭 시 동작
    const handleNavigate = (path) => {
        navigate(path);

        // 전자결재 메뉴 눌렀을 때만 하위 메뉴로 전환
        if (path === "/approval") {
            setIsApprovalMode(true);
        } else {
            setIsApprovalMode(false);
        }
    };

    return (
        <>
            {/* 첫 번째 메뉴 그룹 */}
            {/* 여기는 사용하지 마세요. 아래 두번째에다가 해주세요. */}
            <Nav className="flex-column me-3">
                <Nav.Link
                    onClick={() => handleNavigate('/home')}
                    active={location.pathname === '/home'}
                >
                    홈
                </Nav.Link>
                <Nav.Link
                    onClick={() => handleNavigate('/approval')}
                    active={location.pathname.startsWith('/approval')}
                >
                    전자결제
                </Nav.Link>
                <Nav.Link
                    onClick={() => handleNavigate('/settings')}
                    active={location.pathname === '/settings'}
                >
                    캘린더
                </Nav.Link>
            </Nav>

            {/* 두 번째 메뉴 그룹 */}
            <Nav className="flex-column border-start ps-3">
                <Nav.Link
                    onClick={() => navigate('/login')}
                    active={location.pathname === '/login'}
                >
                    로그인 테스트
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/schedule')}
                    active={location.pathname === '/schedule'}
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
                    onClick={() => navigate('/help')}
                    active={location.pathname === '/help'}
                >
                    여기다가 각자 메뉴 링크 만들기1
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/faq')}
                    active={location.pathname === '/faq'}
                >
                    여기다가 각자 메뉴 링크 만들기2
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/terms')}
                    active={location.pathname === '/terms'}
                >
                    여기다가 각자 메뉴 링크 만들기3
                </Nav.Link>
                <Nav.Link
                    onClick={() => navigate('/terms2')}
                    active={location.pathname === '/terms2'}
                >
                    여기다가 각자 메뉴 링크 만들기4
                </Nav.Link>
            </Nav>
            {isApprovalMode ? (
                // ✅ 전자결재 눌렀을 때만 표시되는 중분류 메뉴
                <Nav className="flex-column border-start ps-3">
                    <Nav.Link
                        onClick={() => navigate('/approval/request')}
                        active={location.pathname === '/approval/request'}
                    >
                        📝 기안 작성
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/approval/status')}
                        active={location.pathname === '/approval/status'}
                    >
                        📄 결재 현황
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/approval/temp')}
                        active={location.pathname === '/approval/temp'}
                    >
                        📂 임시 보관함
                    </Nav.Link>
                </Nav>
            ) : (
                // ✅ 기본 중분류 메뉴
                <Nav className="flex-column border-start ps-3">
                    <Nav.Link
                        onClick={() => navigate('/login')}
                        active={location.pathname === '/login'}
                    >
                        로그인 테스트
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/schedule')}
                        active={location.pathname === '/schedule'}
                    >
                        스케쥴 테스트
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/help')}
                        active={location.pathname === '/help'}
                    >
                        여기다가 각자 메뉴 링크 만들기1
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/faq')}
                        active={location.pathname === '/faq'}
                    >
                        여기다가 각자 메뉴 링크 만들기2
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/terms')}
                        active={location.pathname === '/terms'}
                    >
                        여기다가 각자 메뉴 링크 만들기3
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/terms2')}
                        active={location.pathname === '/terms2'}
                    >
                        여기다가 각자 메뉴 링크 만들기4
                    </Nav.Link>
                </Nav>
            )}
        </>
    );
}

export default App;
