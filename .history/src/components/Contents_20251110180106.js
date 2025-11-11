import React, { useState, useCallback, useEffect, useContext } from "react";
import { Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CardCategory from "./CardCategory";


//메뉴 경로 불러오기
import { useLocation, useNavigate } from "react-router-dom";
import { MemberMenu } from "../ui/MemberMenu";
import { BoardMenu } from "../ui/BoardMenu";
import { ApprovalMenu } from "../ui/ApprovalMenu";
import { AttendanceMenu } from "../ui/AttendanceMenu";
import { SalaryMenu } from "../ui/SalaryMenu";
import { HomeMenu } from "../ui/HomeMenu";
import { CalendarMenu } from "../ui/CalendarMenu";
import { VacationMenu } from "../ui/VacationMenu";

export default function Contents({ children }) {

    const categories = [
        ...HomeMenu,
        ...MemberMenu,
        ...ApprovalMenu,
        ...CalendarMenu,
        ...BoardMenu,
        ...SalaryMenu,
        ...AttendanceMenu,
        ...VacationMenu,
    ];

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selected, setSelected] = useState(null);
    const [expandedAll, setExpandedAll] = useState(false);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const storedKey = "storedCategory";

    const handleCategoryClick = (cat) => {

        const findMenu = cat.subs.find(sub => sub.no === cat.baseToNo);

        if (findMenu == null) {
            alert("해당 카테고리의 기본 경로가 설정되어 있지 않습니다.");
            return;
        } else {
            // 기본 경로로 이동
            navigate(findMenu.to);

            setSelected(findMenu);
            setSelectedCategory(cat);
            updateSessionStorageItem(storedKey, { id: cat.id, no: cat.baseToNo });
        }
    };

    const updateSessionStorageItem = (key, updates) => {
        // 1️⃣ 기존 데이터 가져오기
        const existing = sessionStorage.getItem(key);
        const parsed = existing ? JSON.parse(existing) : {};

        // 2️⃣ 기존 데이터에 새 값 덮어쓰기
        const updated = { ...parsed, ...updates };

        // 3️⃣ 다시 저장
        sessionStorage.setItem(key, JSON.stringify(updated));
    }

    const handleSelect = ((item) => {
        if (item?.no === selected?.no) {
            return;
        }
        if (item.isAdminMenu && user?.role !== 'ROLE_ADMIN') {
            alert("관리자만 접근할 수 있는 메뉴입니다.");
            return;
        }
        setSelected(item);
        navigate(item.to);
        updateSessionStorageItem(storedKey, { no: item.no });
        // 스크롤 이동 기능 임시
        if (categories.id !== 'home') {
            // const el = document.getElementById("approval-page");
            // el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    const handleToggleAll = () => setExpandedAll((prev) => !prev);

    // 브라우저 창 크기 변경 시 높이 업데이트
    // useEffect(() => {
    //     const handleResize = () => setWindowHeight(window.innerHeight);
    //     window.addEventListener("resize", handleResize);

    //     if (selectedCategory === null && selected === null) {
    //         // 현재 경로에 맞는 카테고리와 서브아이템 찾기
    //         // 새로고침시 현재 경로에 맞는 카테고리와 서브아이템 설정
    //         const storedCategory = sessionStorage.getItem(storedKey);
    //         if (storedCategory) {
    //             const { id, no } = JSON.parse(storedCategory);
    //             const category = categories.find(cat => cat.id === id);
    //             if (category) {
    //                 setSelectedCategory(category);
    //                 const findItem = category.subs.find(sub => sub.no === no);
    //                 setSelected(findItem);
    //                 handleSelect(findItem);
    //             } else {

    //             }
    //         }
    //     }
    //     return () => window.removeEventListener("resize", handleResize);
    // }, []);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        console.log(location.pathname);
        const path

        const findItem = category.subs.find(sub => sub.to === no);

        if (selectedCategory === null && selected === null) {



            // 현재 경로에 맞는 카테고리와 서브아이템 찾기
            // 새로고침시 현재 경로에 맞는 카테고리와 서브아이템 설정
            const storedCategory = sessionStorage.getItem(storedKey);
            if (storedCategory) {
                const { id, no } = JSON.parse(storedCategory);
                const category = categories.find(cat => cat.id === id);
                if (category) {
                    setSelectedCategory(category);
                    const findItem = category.subs.find(sub => sub.no === no);
                    setSelected(findItem);
                    handleSelect(findItem);
                } else {

                }
            }
        }
        return () => window.removeEventListener("resize", handleResize);
    }, [location.pathname]);

    return (

        <Box
            sx={{
                display: "flex",
                flexGrow: 1,
                // minHeight: mainHeight,
                marginTop: 0.2,
                marginBottom: 0.2,
                border: "1px solid #ddd"
            }}
        >
            {/* 왼쪽 메뉴(대분류 카테고리) */}
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
                {/* 중분류가 사용일때  */}
                {(selectedCategory?.useSubs ?? false) && selectedCategory?.subs?.length > 0 && (
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
                            {selectedCategory.subs
                                .filter(sub => {
                                    if (user.role === "ROLE_ADMIN") return true; // 관리자면 모두 표시
                                    return sub.isAdminMenu === false; // 일반 유저는 isAdminMenu false만
                                })
                                .map(sub => (
                                    <CardCategory
                                        key={sub.no}
                                        data={sub}
                                        selected={selected?.no === sub.no}
                                        onSelect={handleSelect}
                                        expanded={expandedAll}
                                    />
                                ))}
                        </Box>
                    </>
                )}

                {/* 컨텐츠 영역 */}
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
                        {children}
                        <div id="approval-page"></div>
                    </Card.Body>
                </Card>
            </Box>
        </Box>
    );
}
