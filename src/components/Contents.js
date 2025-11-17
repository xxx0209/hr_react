import React, { useState, useEffect, useContext } from "react";
import { Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import CardCategory from "./CardCategory";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { matchPath, useLocation, useNavigate } from "react-router-dom";

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
    const [movePath, setMovePath] = useState(null);
    const [expandedAll, setExpandedAll] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();



    // -----------------------------
    // 카테고리 클릭 처리
    // -----------------------------
    const handleCategoryClick = (cat) => {
        const defaultSub = cat.subs.find(sub => sub.no === cat.baseToNo);
        if (!defaultSub) {
            alert("해당 카테고리의 기본 경로가 설정되어 있지 않습니다.");
            return;
        }
        setSelectedCategory(cat); //대분류
        handleSelect(defaultSub);
    };

    // -----------------------------
    // 중분류 선택 처리
    // -----------------------------
    const handleSelect = (item) => {
        //if (!item || item.no === selected?.no) return;

        if (item.isAdminMenu && user?.role !== 'ROLE_ADMIN') {
            alert("관리자만 접근할 수 있는 메뉴입니다.");
            return;
        }

        setIsAuth(true);

        const targetPath = Array.isArray(item.to) ? item.to[0] : item.to;
        setSelected(item);
        setMovePath(targetPath); // 이동할 경로       
    };

    const handleToggleAll = () => setExpandedAll(prev => !prev);

    // -----------------------------
    // URL 변경 시 상태 동기화
    // -----------------------------
    useEffect(() => {
        if (selected) {
            if (selected.isAdminMenu && user.role != 'ROLE_ADMIN') {
                alert('접근권한이 없습니다.');
                movePath = "/home";
            }
            if (movePath) {
                if (movePath == '/') {
                    navigate("/home", { replace: true });
                } else {
                    navigate(movePath);
                }
            }
        }

    }, [selected]);

    // 새로고침이나 바로가기로 접근시
    useEffect(() => {
        const targetPath = location.pathname;

        if (targetPath != movePath) {
            // 해당 경로에 일치하는 카테고리가 있는지 조회
            const matchedCategory = categories.find(category =>
                category.subs.some(sub =>
                    Array.isArray(sub.to)
                        ? sub.to.some(path => matchPath({ path, end: true }, targetPath))
                        : matchPath({ path: sub.to, end: true }, targetPath)
                )
            );

            if (matchedCategory) {
                const matchedSub = matchedCategory.subs.find(sub =>
                    Array.isArray(sub.to)
                        ? sub.to.some(path => matchPath({ path, end: true }, targetPath))
                        : matchPath({ path: sub.to, end: true }, targetPath)
                );

                if (matchedSub.isAdminMenu && user.role != 'ROLE_ADMIN') {
                    navigate("/home");
                    alert('접근권한이 없습니다.');
                    return;

                } else {
                    setIsAuth(true);
                    setSelectedCategory(matchedCategory); //대분류
                    setSelected(matchedSub);
                    setMovePath(targetPath);
                }
            }
        }

    }, [location.pathname]);

    // -----------------------------
    // 렌더
    // -----------------------------
    return (
        <Box sx={{ display: "flex", flexGrow: 1, marginTop: 0.2, marginBottom: 0.2, border: "1px solid #ddd" }}>
            {/* 왼쪽 메뉴 */}
            <Box sx={{ width: 200, bgcolor: "background.paper", borderRight: "1px solid #ddd", marginTop: 0 }}>
                <List sx={{ flexGrow: 1, overflowY: "auto", padding: 1 }}>
                    {categories.map(cat => (
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
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(212, 212, 212, 0.1)",
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
            <Box sx={{ flexGrow: 1, padding: 1, bgcolor: "background.paper", display: "flex", flexDirection: "column" }}>
                {/* 중분류 */}
                {isAuth && selectedCategory?.useSubs && selectedCategory?.subs?.length > 0 && (
                    <>
                        <Box
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, cursor: 'pointer' }}
                            onClick={handleToggleAll}
                        >
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    backgroundColor: '#f08f97ff',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    '&:hover': { backgroundColor: '#63b0e0' },
                                }}
                            >
                                {expandedAll ? <ExpandLessIcon sx={{ fontSize: 16, color: 'white' }} /> : <ExpandMoreIcon sx={{ fontSize: 16, color: 'white' }} />}
                            </Box>

                            <Typography sx={{ fontSize: 12, fontWeight: 'bold', lineHeight: '24px' }}>
                                {expandedAll ? '모두 닫기' : '모두 열기 (열기를 클릭시 메뉴 상세 정보를 볼수 있습니다.)'}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 1, mb: 2 }}>
                            {selectedCategory.subs
                                .filter(sub => user.role === "ROLE_ADMIN" || sub.isAdminMenu === false)
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
                <Card className="w-100" style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 0, margin: 0 }}>
                    <Card.Body style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "auto", padding: 0 }}>
                        {isAuth && children}
                        <div id="approval-page"></div>
                    </Card.Body>
                </Card>
            </Box>
        </Box>
    );
}
