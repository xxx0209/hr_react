import { useState, useEffect, useContext } from "react";
import { Card, Badge, Row, Col } from "react-bootstrap";
import axios from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/config";
import { PersonFill, EnvelopeFill, CalendarFill, GeoAltFill } from "react-bootstrap-icons";

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
        imageError: false,   // ⬅⬅⬅ 추가
    });

    const [loading, setLoading] = useState(true);

    const formatDate = (yyyymmdd) => {
        if (!yyyymmdd || yyyymmdd.length !== 8) return "입사일 없음";
        const year = parseInt(yyyymmdd.substring(0, 4), 10);
        const month = parseInt(yyyymmdd.substring(4, 6), 10) - 1;
        const day = parseInt(yyyymmdd.substring(6, 8), 10);
        const date = new Date(year, month, day);
        return date.toLocaleDateString();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    imageError: false,
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
                <div style={{ position: "relative", marginBottom: 12 }}>
                    <div style={{
                        width: 115,         // 기존 이미지 크기
                        height: 115,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid #ced4da",
                        margin: "0 auto",
                        backgroundColor: "#f8f9fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        {form.profileImageUrl && !form.imageError ? (
                            <img
                                src={`${API_BASE_URL}${form.profileImageUrl}`}
                                alt="프로필"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={() => setForm(prev => ({ ...prev, imageError: true }))}
                            />
                        ) : (
                            <span style={{ fontSize: 12, color: "#adb5bd", textAlign: "center" }}>
                                사진없음
                            </span>
                        )}
                    </div>
                    <span
                        style={{
                            position: "absolute",
                            bottom: -8,
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "0.75rem",
                            padding: "0.15em 0.15em",
                            fontWeight: "normal",
                            backgroundColor: "#8f8d8bff", // 원하는 배경색
                            color: "#fff", // 글자색
                            borderRadius: "0.25rem", // Badge처럼 둥글게
                            display: "inline-block",
                            textAlign: "center",
                        }}
                    >
                        {form.positionName || "직급 없음"}
                    </span>
                </div>
                {/* 이름 & 부서 */}
                <Card.Body className="pt-0" style={{ paddingBottom: 8 }}>
                    <Card.Title style={{ fontWeight: "bold", fontSize: "1rem", color: "#495057", marginBottom: 2 }}>
                        {form.name || "이름 없음"}
                    </Card.Title>

                    <hr style={{ margin: "0.5rem 0", borderColor: "#777676ff" }} />

                    {/* 추가 정보 */}
                    <div className="text-start">
                        <Row className="align-items-center mb-2" style={{ color: "#6c757d", fontSize: "0.85rem", fontWeight: "normal" }}>
                            <Col xs="auto"><PersonFill style={{ color: "#6c757d", fontSize: "0.9rem" }} /></Col>
                            <Col>
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: form.gender === "MALE" ? "#4a90e2" : "#f06292" }} />
                                    <span>{form.gender === "MALE" ? "남성" : "여성"}</span>
                                </div>
                            </Col>
                        </Row>
                        <Row className="align-items-center mb-2" style={{ color: "#6c757d", fontSize: "0.85rem", fontWeight: "normal" }}>
                            <Col xs="auto"><EnvelopeFill style={{ color: "#6c757d", fontSize: "0.9rem" }} /></Col>
                            <Col>{form.email || "이메일 없음"}</Col>
                        </Row>
                        <Row className="align-items-center mb-2" style={{ color: "#6c757d", fontSize: "0.85rem", fontWeight: "normal" }}>
                            <Col xs="auto"><CalendarFill style={{ color: "#6c757d", fontSize: "0.9rem" }} /></Col>
                            <Col>{form.hiredate ? formatDate(form.hiredate) : "입사일 없음"}</Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card.Body>
        </Card>
    );
}

