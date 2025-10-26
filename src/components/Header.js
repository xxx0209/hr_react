import React, { useContext } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Header() {
    
    const navigate = useNavigate();

    const { user, setUser } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return (        
            <Navbar bg="light" className="border-bottom">
                <Container className="d-flex justify-content-between">
                    <Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
                        🔵 여기다가 나중에 로고 넣기
                    </Navbar.Brand>
                    {user ? (
                        <div>
                            <strong>{user.username} 님 &nbsp;</strong>
                            <Button onClick={handleLogout}>로그아웃</Button>
                        </div>
                    ) : ("로그인 필요")}
                   
                </Container>
            </Navbar>
    );
}

export default Header;
