import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "../../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import RadioGroup from "../../sample/RadioGroup";
import { EnumContext } from "../../context/EnumContext";
import { API_BASE_URL } from "../../config/config";

export default function MemberDashBoardPage() {

    const navigate = useNavigate();
    const enums = useContext(EnumContext);
    const { user } = useContext(AuthContext);

    const [form, setForm] = useState({
        id: user.memberId,
        name: "",
        password: "",
        email: "",
        gender: "",
        hiredate: "",
        address: "",
        positionName: "",
        profileImage: null,
        profileImageUrl: null, // 서버 이미지 URL
    });

    const [preview, setPreview] = useState(null); // 선택한 파일 미리보기
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    //폼 유효성 검사(Form Validation Check) 관련 state 정의 : 입력 양식에 문제 발생시 값을 저장할 곳
    const [errors, setErrors] = useState({
        name: '', password: '', email: '', gender: '', address: '', general: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resMember = await axios.get(`/member/info`);
                setForm(prev => ({
                    ...prev,
                    ...resMember.data,
                    password: "",
                    profileImage: null,
                    profileImageUrl: resMember.data.profileImageUrl || null,
                }));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const onChange = (e) => {
        const { name, value, files } = e?.target || e;

        if (name === "profileImage") {
            const file = files[0];
            setForm(prev => ({ ...prev, profileImage: file }));

            if (file) setPreview(URL.createObjectURL(file));
            else setPreview(null);
        } else if (name === "hiredate") {
            // YYYY-MM-DD → YYYYMMDD
            setForm(prev => ({ ...prev, [name]: value.replace(/-/g, "") }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value !== null && value !== "") formData.append(key, value);
            });

            await axios.put("/member/update", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccess("✅ 회원 정보가 수정되었습니다!");
        } catch (err) {
            if (err.response && err.response.data) {
                // 서버에서 받은 오류 정보를 객체로 저장합니다.
                setErrors(err.response.data);
            } else { // 입력 값 이외에 발생하는 다른 오류와 관련됨.
                setErrors((previous) => ({ ...previous, general: '회원 수정 중에 오류가 발생하였습니다.' }));
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Card className="dashboard-card text-center">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                {
                    form.profileImageUrl ? (
                                        <img
                                            src={`${API_BASE_URL}${form.profileImageUrl}`}
                                            alt="프로필"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: 12, color: "#6c757d", textAlign: "center" }}>
                                            사진없음
                                        </span>
                                    )
                }
                
                <h5>{form.name}</h5>
                <p className="text-muted small mb-1">직급 / {form.positionName || '없음'}</p>
            </Card.Body>
        </Card>
    );
}

