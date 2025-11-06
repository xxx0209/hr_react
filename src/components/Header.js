import React, { useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { Button } from "@mui/material";

function Header() {

    const { user, setUser } = useContext(AuthContext);
    
    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    const navigate = useNavigate();

    return (        
        <>
            <style>
                {`
                .custom-navbar {
                    background-color: #333 !important;
                    padding-top: 0.25rem;
                    padding-bottom: 0.25rem;
                }
                `}
            </style>
            <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand style={{ color: 'white', cursor: 'pointer' }} onClick={() => navigate('/home')}>HR Management</Navbar.Brand>
                <Nav className="ms-auto">              
                {user ? (
                            <div>
                                <strong style={{color: 'white'}}>{user.username} 님 반갑습니다.&nbsp;</strong>
                                <Button
                                    variant="text" // 또는 "contained", "text"
                                    startIcon={<LogoutIcon />}
                                    onClick={handleLogout}
                                    sx={{
                                    color: "white",
                                    '&:hover': {
                                        color: '#e53935',              // 마우스 올렸을 때 글자색
                                        backgroundColor: 'rgba(229,57,53,0.1)', // 살짝 붉은 배경
                                    },
                                    }}
                                >
                                    로그아웃
                                </Button>
                            </div>
                        ) : ("로그인 필요")}
                
                </Nav>
            </Container>
            </Navbar>
        </> 
    );
}

export default Header;
