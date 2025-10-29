import { useState } from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";

// useNavigate 훅은 특정한 페이지로 이동하고자 할 때 사용되는 훅입니다.
import { useLocation, useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    // 전자결제 메뉴 활성화 여부 체크
    const [isApprovalMode, setIsApprovalMode] = useState(false);
    const [isSalaryMode, setIsSalaryMode] = useState(false);

    // 게시판 메뉴 하위 메뉴 활성화 여부 체크
    const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null); // 활성화된 메뉴를 트래킹

    // 메뉴 클릭 시 동작
    const handleNavigate = (path, menu) => {
        navigate(path);

        // 메뉴가 클릭될 때마다 활성화 상태를 설정
        setActiveMenu(menu);

        // 전자결재 메뉴 눌렀을 때만 하위 메뉴로 전환
        if (path === "/approval") {
            setIsApprovalMode(true);
            setIsPostMenuOpen(false); // 게시판 하위 메뉴 닫기
            setIsSalaryMode(false);
        } else if (path === "/salary") { // 급여 메뉴 클릭시
            setIsSalaryMode(true);
            setIsApprovalMode(false);
        } else {
            setIsApprovalMode(false);
            setIsSalaryMode(false);
        }

        // 게시판 메뉴 눌렀을 때 하위 메뉴 토글
        if (path === "/board") {
            setIsPostMenuOpen(!isPostMenuOpen);  // 게시판 메뉴 상태 변경 (열고 닫기)
        } else {
            setIsPostMenuOpen(false);  // 다른 메뉴를 클릭하면 게시판 하위 메뉴 닫기
        }
    };

    return (
        <>
            {/* 기본 중분류 메뉴 */}
            <Nav className="flex-column me-3">
                <Nav.Link
                    onClick={() => handleNavigate('/home', 'home')}
                    active={location.pathname === '/home'}
                >
                    홈
                </Nav.Link>
                <Nav.Link
                    onClick={() => handleNavigate('/approval', 'approval')}
                    active={location.pathname.startsWith('/approval')}
                >
                    전자결제
                </Nav.Link>
                <Nav.Link
                    onClick={() => handleNavigate('/settings', 'settings')}
                    active={location.pathname === '/settings'}
                >
                    캘린더
                </Nav.Link>
                <Nav.Link
                    onClick={() => handleNavigate('/salary')}
                    active={location.pathname === '/salary'}
                >
                    급여관련
                </Nav.Link>
                <Nav.Link
                    onClick={() => handleNavigate('/board', 'board')}
                    active={location.pathname === '/board'}
                >
                    게시판
                </Nav.Link>
            </Nav>

            {/* 두 번째 메뉴 그룹 */}
            {isApprovalMode ? (
                // 전자결재 눌렀을 때만 표시되는 중분류 메뉴
                <Nav className="flex-column border-start ps-3">
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
                </Nav>
            ) : activeMenu === 'board' && isPostMenuOpen ? (

                // ✅ 게시판 하위 메뉴
                <Nav className="flex-column border-start ps-3">
                    <Row className="mb-3">
                        <Col xs={12} className="text-center">
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-100"
                                onClick={() => navigate('/board/create')} // 글쓰기 페이지로 이동
                            >
                                글쓰기
                            </Button>
                        </Col>
                    </Row>

                    <Nav.Link
                        onClick={() => navigate('/board/notice')}
                        active={location.pathname === '/board/notice'}
                    >
                        📄 공지사항
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/board/free')}
                        active={location.pathname === '/board/free'}
                    >
                        📂 자유 게시판
                    </Nav.Link>
                </Nav>

            ) : isSalaryMode ? (
                <Nav className="flex-column border-start ps-3">
                    <Nav.Link
                        onClick={() => navigate('/salary/manage')}
                        active={location.pathname === '/salary/manage'}
                    >
                        📋 나의 급여 내역
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/salary/admin')}
                        active={location.pathname === '/salary/admin'}
                    >
                        🧾 급여 관리 (관리자)
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/salary/admin/create')}
                        active={location.pathname === '/salary/admin/create'}
                    >
                        ➕ 급여 생성
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/salary/base-salary')}
                        active={location.pathname === '/salary/base-salary'}
                    >
                        ⚙️ 기본급 설정
                    </Nav.Link>


                </Nav>
            ) : (

                // 기본 중분류 메뉴
                <Nav className="flex-column border-start ps-3">
                    <Nav.Link
                        onClick={() => navigate('/samplePage')}
                        active={location.pathname === '/samplePage'}
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
                        onClick={() => navigate('/position')}
                        active={location.pathname === '/position'}
                    >
                        직급등록 테스트
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/position/list')}
                        active={location.pathname === '/position/list'}
                    >
                        직급 리스트 테스트
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/position/history/list')}
                        active={location.pathname === '/position/history/list'}
                    >
                        직급내역 리스트 테스트
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/position/history/save')}
                        active={location.pathname === '/position/history/save'}
                    >
                        직급내역 등록 테스트
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => navigate('/attendance/attendance')}
                        active={location.pathname === '/attendance'}
                    >
                        출퇴근 기능 테스트
                    </Nav.Link>
                    <Nav.Link
                        onClick={() => navigate('/attendance/leave')}
                        active={location.pathname === '/attendance'}
                    >
                        휴가 현황 테스트
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
