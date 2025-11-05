import React, { useState } from "react";
import { Navbar, Container, Nav, Row, Col, Card } from "react-bootstrap";
import {
    Home as HomeIcon, People as PeopleIcon, AssignmentTurnedIn as AssignmentTurnedInIcon,
    CalendarMonth as CalendarMonthIcon, Forum as ForumIcon,
} from "@mui/icons-material";
import {
    AttachMoney as AttachMoneyIcon, AccessTime as AccessTimeIcon, BeachAccess as BeachAccessIcon,
    Logout as LogoutIcon, Diversity3 as Diversity3Icon, EditDocument as EditDocumentIcon,
    ManageAccounts as ManageAccountsIcon
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Facebook from "./Media";
import ApprovalRequestPage from "../pages/ApprovalRequestPage";
import Icon from '@mui/material/Icon';


function App() {
    const [selectedCategory, setSelectedCategory] = useState(null);


    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);

    };

    const [selected, setSelected] = React.useState(null);

    const handleSelect = (item) => {
        setSelected(item); // ✅ 선택된 카드 정보 저장
        // 선택한 카드로 스크롤 이동
        const el = document.getElementById("approval-page");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };


    const categories = [
        {
            id: 1,
            icon: <HomeIcon sx={{ color: '#8b8c8dff' }} />, // 파란색
            label: "홈",
            subs: [],
        },
        {
            id: 2,
            icon: <PeopleIcon sx={{ color: '#8b8c8dff' }} />, // 초록색
            label: "회원관리",
            subs: [
                {
                    id: 21, label: "회원정보 수정", to: "/profile/edit", icon: ManageAccountsIcon,
                    content: "회원의 기본 정보를 수정할수 있는 메뉴 입니다.\r\n  아이디, 비밀번호, 이메일, 프로필 사진 등을 변경할 수 있습니다."
                },
                { id: 22, label: "직급등록", to: "/member/position/list", icon: Diversity3Icon, content: "회사의 직급체계를 관리합니다.\r\n  관리자는 직급을 추가, 수정, 삭제할 수 있습니다." },
                { id: 23, label: "직급내역", to: "/member/position/history/list", icon: EditDocumentIcon, content: "직급의 변경 내역을 확인합니다.\r\n 관리자는 직급을 추가, 수정, 삭제할 수 있습니다." },
                { id: 24, label: "테스트", to: "/member/position/history/list", icon: EditDocumentIcon, content: "직급의 변경 내역을 확인합니다.\r\n 관리자는 직급을 추가, 수정, 삭제할 수 있습니다." },
            ],
        },
        {
            id: 3,
            icon: <AssignmentTurnedInIcon sx={{ color: '#8b8c8dff' }} />, // 주황색
            label: "전자결재",
            subs: [
                { id: 31, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
                { id: 32, label: "회원 등록", content: "새로운 회원을 등록합니다." },
            ]
        },
        {
            id: 4,
            icon: <CalendarMonthIcon sx={{ color: '#8b8c8dff' }} />, // 빨간색
            label: "캘린더",
            subs: [
                { id: 41, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
                { id: 42, label: "회원 등록", content: "새로운 회원을 등록합니다." },
            ]
        },
        {
            id: 5,
            icon: <ForumIcon sx={{ color: '#8b8c8dff' }} />, // 보라색
            label: "게시판",
            subs: [
                { id: 51, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
                { id: 52, label: "회원 등록", content: "새로운 회원을 등록합니다." },
            ]
        },
        {
            id: 6,
            icon: <AttachMoneyIcon sx={{ color: '#8b8c8dff' }} />, // 초록색
            label: "급여관리",
            subs: [
                { id: 61, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
                { id: 62, label: "회원 등록", content: "새로운 회원을 등록합니다." },
            ]
        },
        {
            id: 7,
            icon: <AccessTimeIcon sx={{ color: '#8b8c8dff' }} />, // 하늘색
            label: "근태",
            subs: [
                { id: 71, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
                { id: 72, label: "회원 등록", content: "새로운 회원을 등록합니다." },
            ]
        },
        {
            id: 8,
            icon: <BeachAccessIcon sx={{ color: '#8b8c8dff' }} />, // 청록색
            label: "휴가",
            subs: [
                { id: 81, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
                { id: 82, label: "회원 등록", content: "새로운 회원을 등록합니다." },
            ]
        },
        {
            id: 9,
            icon: <LogoutIcon sx={{ color: '#8b8c8dff' }} />, // 회색
            label: "로그아웃",
            subs: [
                { id: 91, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
                { id: 92, label: "회원 등록", content: "새로운 회원을 등록합니다." },
            ]
        },
    ];

    return (
        <div
            className="d-flex flex-column"
            style={{ height: "100vh", overflow: "hidden" }} // ✅ 전체 화면 딱 맞게
        >

            {/* Header */}
            <Navbar
                bg="dark"
                variant="dark"
                expand="lg"
                style={{ minHeight: "60px" }}
            >
                <Container fluid>
                    {/* Brand */}
                    <Navbar.Brand
                        href="/"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            flexShrink: 0, // 줄어들지 않게 고정
                        }}
                    >
                        HR Management System

                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <HomeIcon sx={{ color: 'white' }} >33333</HomeIcon>
                        </ListItemIcon>
                    </Navbar.Brand>

                    {/* 반응형 토글 */}
                    <Navbar.Toggle aria-controls="navbar-nav" />

                    <Navbar.Collapse id="navbar-nav">
                        {/* 오른쪽 메뉴 */}
                        <Nav className="ms-auto" style={{ alignItems: "center" }}>
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/">About</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Main (자동으로 남은 공간 차지) */}
            <Container
                fluid
                // className="flex-grow-1 p-0 d-flex"
                // style={{ minHeight: 0 }} // ✅ flex 컨테이너 내부 overflow 방지

                className="flex-grow-1 p-0 d-flex"
                style={{
                    minHeight: 0,
                    overflow: "hidden", // 전체 컨테이너는 숨기고
                }}
            >
                {/* 왼쪽 메뉴 */}
                <Box
                    sx={{
                        width: 240,
                        height: "100%",
                        bgcolor: "background.paper",
                        borderRight: "1px solid #ddd",
                        display: "flex",
                        flexDirection: "column",
                        // justifyContent: "center", // ✅ 세로 가운데 정렬
                    }}
                >
                    <List sx={{
                        //flexGrow: 1,
                        overflowY: "auto",
                        //display: "flex",
                        //flexDirection: "column",
                        alignItems: "center", // ✅ 버튼을 가로 가운데 정렬
                        padding: 1,
                    }}>
                        {categories.map((cat, index) => (
                            <ListItemButton
                                key={index}
                                selected={selectedCategory?.id === cat.id}
                                onClick={() => handleCategoryClick(cat)}
                                sx={{
                                    mb: 1, // ✅ 버튼 사이 아래 간격 1
                                    // border: "1px solid #ccc", // 기본 테두리
                                    borderRadius: 1, // 모서리 둥글게 (옵션)
                                    "&.Mui-selected": {
                                        backgroundColor: "#cac8c8ff", //선택된 버튼의 배경색
                                        color: "white", //선택된 버튼의 텍스트 색
                                        "& .MuiListItemIcon-root": {
                                            color: "white",
                                        },
                                        border: "2px solid #afaeaeff", // 선택 시 테두리 강조
                                        "& .MuiListItemIcon-root": {
                                            color: "white",
                                        },
                                        "&:hover": {
                                            backgroundColor: "#e7e5e5ff", // 선택 시 hover도 같은 색
                                        },
                                    },
                                    "&:hover": {
                                        backgroundColor: selectedCategory?.id === cat.id ? "#eb1818ff" : "rgba(212, 212, 212, 0.1)",
                                        borderColor: selectedCategory?.id === cat.id ? "#dad8d8ff" : "#1976d2",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {React.cloneElement(cat.icon, {
                                        sx: {
                                            fontSize: 24,
                                            color: selectedCategory?.id === cat.id ? "white" : "#8b8c8dff",
                                        },
                                    })}
                                </ListItemIcon>
                                <ListItemText primary={cat.label} sx={{
                                    "& .MuiTypography-root": { fontSize: '0.85rem' } // 폰트 작게
                                }} />

                            </ListItemButton>
                        ))}
                    </List>
                </Box>

                {/* 오른쪽 컨텐츠 */}
                <Row className="flex-grow-1 w-100 m-0" style={{ overflow: "hidden" }}>
                    <Col

                        className="p-2"
                        style={{
                            overflowY: "auto", // 여기서만 스크롤
                            height: "calc(100vh - 120px)", // Header + Footer 높이만큼 빼기
                            backgroundColor: "#fafafa",
                        }}
                    >
                        {selectedCategory && (
                            <>
                                {/* <h5 className="mb-3">{selectedCategory.label}의 중분류</h5> */}
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                        gap: 2, // 카드 간격
                                        width: "100%",
                                        padding: 0, // ✅ 기존 padding 제거
                                        marginTop: 0, // 필요시 margin 제거
                                    }}
                                >
                                    {selectedCategory.subs.map((sub) => (
                                        <Facebook
                                            key={sub.id}
                                            data={sub}
                                            selected={selected?.id === sub.id} // 선택된 카드
                                            onSelect={handleSelect}

                                        />
                                    ))}
                                </Box>
                            </>
                        )}

                        {selected && (
                            <div>
                                <Button
                                    variant="secondary"
                                    size="small"
                                    className="mb-3"
                                >
                                    ← 중분류 목록으로
                                </Button>
                                <Card className="h-100 w-100">
                                    <Card.Body
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            padding: 0,
                                            height: "100%",
                                        }}
                                    >

                                        <ApprovalRequestPage />
                                        <div id="approval-page"></div>
                                    </Card.Body>
                                </Card>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <footer
                className="bg-dark text-white py-3 text-center"
                style={{ flex: "0 0 auto" }}
            >
                <small>© 2025 MyApp. All rights reserved.</small>
            </footer>
        </div>
    );
}

export default App;
