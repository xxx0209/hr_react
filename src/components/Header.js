import React, { useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

function Header() {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        setUser(null);
        navigate("/login");
    };

    // 직급과 권한 색상 설정
    const getRoleColor = (role) => {
        switch (role) {
            case "ROLE_ADMIN":
                return "#e53935"; // 관리자 - 붉은색
            case "ROLE_USER":
                return "#4caf50"; // 일반유저 - 초록색
            default:
                return "#757575"; // 기본 색상 (회색)
        }
    };

    const getPositionColor = (position) => {
        switch (position) {
            case "대표이사":
                return "#ff9800"; // 매니저 - 오렌지색            
            default:
                return "#ffffffff"; // 기본 색상 (회색)
        }
    };

    return (
        <>
            <style>
                {`
                .custom-navbar {
                    background-color: #333 !important;
                    padding-top: 0.25rem;
                    padding-bottom: 0.25rem;
                }
                .user-info {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 10px;
                    color: white;
                    font-size: 12px;
                }
                .user-info span {
                    font-weight: bold;
                }
                .role-text {
                    color: ${user && getRoleColor(user.role)};
                }
                .position-text {
                    color: ${user && getPositionColor(user.positionName)};
                }
                `}
            </style>
            <Navbar expand="lg" className="custom-navbar">
                <Container>
                    <Navbar.Brand style={{ color: 'white', cursor: 'pointer' }} onClick={() => navigate('/home')}>
                        HR Management
                    </Navbar.Brand>
                    <Nav className="ms-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        {user ? (
                            <>
                                <Button
                                    variant="text"
                                    startIcon={<LogoutIcon />}
                                    onClick={handleLogout}
                                    sx={{
                                        color: "white",
                                        '&:hover': {
                                            color: '#e53935',
                                            backgroundColor: 'rgba(229,57,53,0.1)',
                                        },
                                    }}
                                >
                                    로그아웃
                                </Button>

                                {/* 사용자 정보 텍스트 */}
                                <div className="user-info">
                                    <Typography sx={{ color: 'white', fontSize: 12, mt: 0.5 }}>
                                        <span style={{ color: '#ffeb3b' }}>{user.username}</span>님 반갑습니다.
                                    </Typography>
                                    <Typography sx={{ color: 'white', fontSize: 12, mt: 0.5 }}>
                                        직급: <span className="position-text">{user.positionName || "-"}</span> /
                                        권한: <span className="role-text">
                                            {user.role === "ROLE_ADMIN" ? "관리자" : "일반유저"}
                                        </span>
                                    </Typography>
                                </div>
                            </>
                        ) : ("로그인 필요")}
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;
