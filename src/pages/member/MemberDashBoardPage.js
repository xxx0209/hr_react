import { useState, useEffect, useContext } from "react";
import { Card } from "react-bootstrap";
import axios from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/config";

export default function MemberDashBoardPage() {

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

    const [loading, setLoading] = useState(true);

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

    if (loading) return <div>Loading...</div>;

    return (
        <Card className="dashboard-card text-center">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center" style={{ gap: "8px" }}>
                {/* 사진 영역 */}
                <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: "2px solid #ced4da", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa" }}>
                    {form.profileImageUrl ? (
                        <img
                            src={`${API_BASE_URL}${form.profileImageUrl}`}
                            alt="프로필"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <span style={{ fontSize: 12, color: "#6c757d", textAlign: "center" }}>
                            사진없음
                        </span>
                    )}
                </div>

                <h5>{form.name}</h5>
                <p className="text-muted small mb-1">직급 / {form.positionName || '없음'}</p>
            </Card.Body>
        </Card>
    );
}

