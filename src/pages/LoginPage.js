import { Container, Row, Col, Form, Button, Alert, InputGroup } from "react-bootstrap";
import bannerImg from "./../assets/logo192.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { login } from "../api/auth";
import { getCurrentUser } from "../api/user";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {

    const navigate = useNavigate();

    const { setUser } = useContext(AuthContext);

    //폼 데이터 state 정의
    const [formData, setFormData] = useState({
        memberId: "",
        password: "",
    });

    //폼 유효성 검사(Form Validation Check) 관련 state 정의 : 입력 양식에 문제 발생시 값을 저장할 곳
    const [errors, setErrors] = useState({
        memberId: '', password: '', general: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.memberId.trim() === "") {
            setErrors(prevErrors => ({
                ...prevErrors,
                memberId: "아이디를 입력해 주세요."
            }));
            return;
        }

        if (formData.password.trim() === "") {
            setErrors(prevErrors => ({
                ...prevErrors,
                password: "비밀번호를 입력해 주세요."
            }));
            return;
        }

        try {

            const response = await login(formData.memberId, formData.password);

            if (response.status === 200) { // 스프링의 MemberController 파일 참조

                const token = response.data.token;

                // JWT 토큰 저장 (실무에선 httpOnly cookie 권장)
                localStorage.setItem('accessToken', token);
                const res = await getCurrentUser();
                setUser(res.data);
                alert("회원가입이 완료되었습니다!");
                navigate('/');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                // 서버에서 받은 오류 정보를 객체로 저장합니다.
                setErrors(error.response.data);
            } else { // 입력 값 이외에 발생하는 다른 오류와 관련됨.
                setErrors((previous) => ({ ...previous, general: '로그인 오류가 발생하였습니다.' }));
            }
        }
    }

    return (
        ""
    );
};

export default LoginPage;
