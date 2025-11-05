import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Card } from "react-bootstrap";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  CalendarMonth as CalendarMonthIcon,
  Forum as ForumIcon,
  AttachMoney as AttachMoneyIcon,
  AccessTime as AccessTimeIcon,
  BeachAccess as BeachAccessIcon,
  Logout as LogoutIcon,
  Diversity3 as Diversity3Icon,
  EditDocument as EditDocumentIcon,
  ManageAccounts as ManageAccountsIcon
} from "@mui/icons-material";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Typography, Button } from "@mui/material";
import Facebook from "./Media";
import ApprovalRequestPage from "../pages/ApprovalRequestPage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selected, setSelected] = useState(null);
  const [expandedAll, setExpandedAll] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // 브라우저 창 크기 변경 시 높이 업데이트
  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategoryClick = (cat) => setSelectedCategory(cat);
  const handleSelect = (item) => {
    setSelected(item);
    const el = document.getElementById("approval-page");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleToggleAll = () => setExpandedAll((prev) => !prev);

  const categories = [
    {
      id: 1,
      icon: <HomeIcon sx={{ color: '#8b8c8dff' }} />,
      label: "홈",
      subs: [],
    },
    {
      id: 2,
      icon: <PeopleIcon sx={{ color: '#8b8c8dff' }} />,
      label: "회원관리",
      subs: [
        { id: 21, label: "회원정보 수정", to: "/profile/edit", icon: ManageAccountsIcon, content: "회원의 기본 정보를 수정할수 있는 메뉴 입니다.\r\n  아이디, 비밀번호, 이메일, 프로필 사진 등을 변경할 수 있습니다." },
        { id: 22, label: "직급등록", to: "/member/position/list", icon: Diversity3Icon, content: "회사의 직급체계를 관리합니다.\r\n  관리자는 직급을 추가, 수정, 삭제할 수 있습니다." },
        { id: 23, label: "직급내역", to: "/member/position/history/list", icon: EditDocumentIcon, content: "직급의 변경 내역을 확인합니다.\r\n 관리자는 직급을 추가, 수정, 삭제할 수 있습니다." },
        { id: 24, label: "테스트", to: "/member/position/history/list", icon: EditDocumentIcon, content: "직급의 변경 내역을 확인합니다.\r\n 관리자는 직급을 추가, 수정, 삭제할 수 있습니다." },
      ],
    },
    {
      id: 3,
      icon: <AssignmentTurnedInIcon sx={{ color: '#8b8c8dff' }} />,
      label: "전자결재",
      subs: [
        { id: 31, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
        { id: 32, label: "회원 등록", content: "새로운 회원을 등록합니다." },
      ]
    },
    {
      id: 4,
      icon: <CalendarMonthIcon sx={{ color: '#8b8c8dff' }} />,
      label: "캘린더",
      subs: [
        { id: 41, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
        { id: 42, label: "회원 등록", content: "새로운 회원을 등록합니다." },
      ]
    },
    {
      id: 5,
      icon: <ForumIcon sx={{ color: '#8b8c8dff' }} />,
      label: "게시판",
      subs: [
        { id: 51, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
        { id: 52, label: "회원 등록", content: "새로운 회원을 등록합니다." },
      ]
    },
    {
      id: 6,
      icon: <AttachMoneyIcon sx={{ color: '#8b8c8dff' }} />,
      label: "급여관리",
      subs: [
        { id: 61, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
        { id: 62, label: "회원 등록", content: "새로운 회원을 등록합니다." },
      ]
    },
    {
      id: 7,
      icon: <AccessTimeIcon sx={{ color: '#8b8c8dff' }} />,
      label: "근태",
      subs: [
        { id: 71, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
        { id: 72, label: "회원 등록", content: "새로운 회원을 등록합니다." },
      ]
    },
    {
      id: 8,
      icon: <BeachAccessIcon sx={{ color: '#8b8c8dff' }} />,
      label: "휴가",
      subs: [
        { id: 81, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
        { id: 82, label: "회원 등록", content: "새로운 회원을 등록합니다." },
      ]
    },
    {
      id: 9,
      icon: <LogoutIcon sx={{ color: '#8b8c8dff' }} />,
      label: "로그아웃",
      subs: [
        { id: 91, label: "회원 목록", content: "모든 회원의 목록을 보여줍니다." },
        { id: 92, label: "회원 등록", content: "새로운 회원을 등록합니다." },
      ]
    },
  ];

  const headerHeight = 56; // Navbar 기본 높이
  const footerHeight = 60; // Footer 높이
  const mainHeight = windowHeight - headerHeight - footerHeight - 32; // margin 포함

  return (
    <div style={{ backgroundColor: "#f0f0f0" }}>
      <div style={{ width: "90%", maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header */}
        <Navbar bg="dark" variant="dark" expand="lg" style={{ paddingTop: "0.25rem", paddingBottom: "0.25rem" }}>
          <Container>
            <Navbar.Brand>HR Management</Navbar.Brand>
            <Nav className="ms-auto">
              <Button
                variant="text" // 또는 "contained", "text"
                startIcon={<LogoutIcon />}
                onClick={() => console.log("로그아웃 클릭!")}
                sx={{
                  color: "#8b8c8dff",
                  '&:hover': {
                    color: '#e53935',              // 마우스 올렸을 때 글자색
                    backgroundColor: 'rgba(229,57,53,0.1)', // 살짝 붉은 배경
                  },
                }}
              >
                로그아웃
              </Button>
            </Nav>
          </Container>
        </Navbar>

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            minHeight: mainHeight,
            marginTop: 0.2,
            marginBottom: 0.2,
            border: "1px solid #ddd"
          }}
        >
          {/* 왼쪽 메뉴 */}
          <Box sx={{ width: 200, bgcolor: "background.paper", borderRight: "1px solid #ddd", marginTop: 0 }}>
            <List sx={{ flexGrow: 1, overflowY: "auto", padding: 1 }}>
              {categories.map((cat) => (
                <ListItemButton
                  key={cat.id}
                  selected={selectedCategory?.id === cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    "&.Mui-selected": {
                      backgroundColor: "#cac8c8ff",
                      color: "white",
                      border: "2px solid #afaeaeff",
                      "& .MuiListItemIcon-root": { color: "white" },
                      "&:hover": { backgroundColor: "#e7e5e5ff" },
                    },
                    "&:hover": {
                      backgroundColor: selectedCategory?.id === cat.id ? "#eb1818ff" : "rgba(212, 212, 212, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {React.cloneElement(cat.icon, { sx: { fontSize: 24, color: selectedCategory?.id === cat.id ? "white" : "#8b8c8dff" } })}
                  </ListItemIcon>
                  <ListItemText primary={cat.label} sx={{ "& .MuiTypography-root": { fontSize: "0.85rem" } }} />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* 오른쪽 컨텐츠 */}
          <Box
            sx={{
              flexGrow: 1,
              paddingLeft: 1,
              paddingRight: 1,
              paddingTop: 1,
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 카테고리 선택이 있을 때만 메뉴 */}
            {selectedCategory && selectedCategory.subs.length > 0 && (
              <>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1, cursor: "pointer" }}
                  onClick={handleToggleAll}
                >
                  <IconButton sx={{ width: 24, height: 24, p: 0 }}>
                    {expandedAll ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                  </IconButton>
                  <Typography variant="body2">{expandedAll ? "모두 닫기" : "모두 열기"}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  {selectedCategory.subs.map((sub) => (
                    <Facebook
                      key={sub.id}
                      data={sub}
                      selected={selected?.id === sub.id}
                      onSelect={handleSelect}
                      expanded={expandedAll}
                    />
                  ))}
                </Box>
              </>
            )}

            {/* Card 영역: 항상 푸터 바로 위까지 채움 */}
            <Card
              className="w-100"
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                marginTop: "0px",   // 위쪽 마진
                marginBottom: "0px", // 아래쪽 마진
                marginLeft: "0px",   // 좌우 마진 필요 시
                marginRight: "0px",
                borderRadius: 0, // ← 여기가 포인트
              }}
            >
              <Card.Body
                style={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto",
                  padding: 0,
                }}
              >
                <ApprovalRequestPage />
                <div id="approval-page"></div>
              </Card.Body>
            </Card>
          </Box>
        </Box>

        {/* Footer */}
        <footer
          style={{
            backgroundColor: "#333",
            color: "white",
            padding: "1rem 0",
            textAlign: "center",
            height: footerHeight,
          }}
        >
          <small>© 2025 HR Management. All rights reserved.</small>
        </footer>
      </div>
    </div>
  );
}

export default App;
