import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

// useNavigate 훅은 특정한 페이지로 이동하고자 할 때 사용되는 훅입니다.
import { useLocation, useNavigate } from "react-router-dom";

function App() {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            {/* 첫 번째 메뉴 그룹 */}
            {/* 여기는 사용하지 마세요. 아래 두번째에다가 해주세요. */}
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
                    onClick={() => navigate('/login')}
                    active={location.pathname === '/login'}
                >
                    로그인 테스트
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
        </>
    );
}

export default App;