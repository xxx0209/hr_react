import { useState, useEffect, useContext } from "react";
import axios from "../../api/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col, Form, Button, Table, Pagination, Modal, Spinner } from "react-bootstrap";
import { API_BASE_URL } from "../../config/config";
import { EnumContext } from "../../context/EnumContext";

export default function MemberSearchPage() {
    const enums = useContext(EnumContext);

    const [searchType, setSearchType] = useState("all");
    const [keyword, setKeyword] = useState("");
    const [hireDate, setHireDate] = useState(null);
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    const [selectedMember, setSelectedMember] = useState(null);
    const [role, setRole] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchData = async (p = 0) => {
        const params = {
            searchType,
            keyword: searchType !== "hireDate" && searchType !== "all" ? keyword : null,
            hireDate: searchType === "hireDate" ? hireDate?.toISOString().substring(0, 10) : null,
            page: p,
            size: pageSize
        };

        const res = await axios.get("/member/search", { params });
        setResults(res.data.content);
        setPage(res.data.number);
        setTotalPages(res.data.totalPages);
    };

    useEffect(() => {
        fetchData(); // 초기 전체 데이터 조회
    }, []);

    const handleSearch = () => fetchData(0);
    const handleReset = () => {
        setSearchType("all");
        setKeyword("");
        setHireDate(null);
        fetchData(0);
    };

    const handlePrev = () => fetchData(page - 1);
    const handleNext = () => fetchData(page + 1);

    const formatHireDate = (dateStr) =>
        dateStr ? `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}` : "-";

    const handleOpenModal = (member) => {
        setSelectedMember(member);
        setRole(member.memberRole); // Enum 값 기준
    };

    const handleSaveRole = async () => {
        if (!window.confirm("권한을 변경하시겠습니까?")) return;
        setSaving(true);
        try {
            await axios.put("/member/update-role", {
                memberId: selectedMember.memberId,
                memberRole: role
            });

            setResults((prev) =>
                prev.map((m) =>
                    m.memberId === selectedMember.memberId ? { ...m, memberRole: role } : m
                )
            );

            setSelectedMember(null);
        } catch (err) {
            console.error(err);
            alert("권한 수정 실패");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container className="py-4">
            <h3 className="mb-4">회원 검색</h3>

            <Row className="mb-3">
                <Col sm={3}>
                    <Form.Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                        <option value="all">전체</option>
                        <option value="username">아이디</option>
                        <option value="name">이름</option>
                        <option value="position">직급</option>
                        <option value="hireDate">입사일</option>
                    </Form.Select>
                </Col>

                <Col sm={5}>
                    {searchType === "hireDate" ? (
                        <DatePicker
                            selected={hireDate}
                            onChange={setHireDate}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            placeholderText="입사일 선택"
                        />
                    ) : searchType !== "all" ? (
                        <Form.Control
                            type="text"
                            placeholder="검색어 입력"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    ) : null}
                </Col>

                <Col sm={4} className="text-end">
                    <Button variant="primary" onClick={handleSearch} className="me-2">검색</Button>
                    <Button variant="secondary" onClick={handleReset}>초기화</Button>
                </Col>
            </Row>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>프로필</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>직급</th>
                        <th>성별</th>
                        <th>이메일</th>
                        <th>입사일</th>
                        <th>권한</th>
                    </tr>
                </thead>
                <tbody>
                    {results.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center text-muted py-3">데이터가 없습니다.</td>
                        </tr>
                    ) : (
                        results.map((m) => (
                            <tr key={m.memberId} style={{ cursor: "pointer" }} onClick={() => handleOpenModal(m)}>
                                <td style={{ width: "60px", padding: 0, textAlign: "center", verticalAlign: "middle" }}>
                                    {m.profileImage ? (
                                        <img
                                            src={`${API_BASE_URL}/images/${m.profileImage}`}
                                            alt="프로필"
                                            style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", display: "block", margin: "0 auto" }}
                                        />
                                    ) : (
                                        <div
                                            style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#e0e0e0", margin: "0 auto" }}
                                        />
                                    )}
                                </td>
                                <td>{m.memberId}</td>
                                <td>{m.name}</td>
                                <td>{m.positionName}</td>
                                <td className="text-center">
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: m.gender === "MALE" ? "#4a90e2" : "#f06292" }} />
                                        <span>{m.gender === "MALE" ? "남" : "여"}</span>
                                    </div>
                                </td>
                                <td>{m.email}</td>
                                <td>{formatHireDate(m.hiredate)}</td>
                                <td>{m.memberRole === "ROLE_ADMIN" ? "관리자" : "일반유저"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-3">
                <Pagination>
                    <Pagination.Prev onClick={handlePrev} disabled={page <= 0} />
                    {[...Array(totalPages).keys()].map((p) => (
                        <Pagination.Item key={p} active={p === page} onClick={() => fetchData(p)}>{p + 1}</Pagination.Item>
                    ))}
                    <Pagination.Next onClick={handleNext} disabled={page >= totalPages - 1} />
                </Pagination>
            </div>

            {/* 모달 */}
            {selectedMember && (
                <Modal show onHide={() => setSelectedMember(null)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>회원 상세</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ fontSize: "12px" }}>
                        <div className="d-flex gap-3 mb-3">
                            <div
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    backgroundColor: "#e0e0e0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {selectedMember.profileImage ? (
                                    <img
                                        src={`${API_BASE_URL}/images/${selectedMember.profileImage}`}
                                        alt="프로필"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div style={{ width: "100%", height: "100%" }} />
                                )}
                            </div>
                            <div>
                                <p><strong>아이디:</strong> {selectedMember.memberId}</p>
                                <p><strong>이름:</strong> {selectedMember.name}</p>
                                <p><strong>직급:</strong> {selectedMember.positionName}</p>
                                <p><strong>성별:</strong> {selectedMember.gender === "MALE" ? "남" : "여"}</p>
                                <p><strong>이메일:</strong> {selectedMember.email}</p>
                                <p><strong>입사일:</strong> {formatHireDate(selectedMember.hiredate)}</p>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>권한</Form.Label>
                            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="ROLE_USER">{enums?.MemberRole?.ROLE_USER || "일반유저"}</option>
                                <option value="ROLE_ADMIN">{enums?.MemberRole?.ROLE_ADMIN || "관리자"}</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setSelectedMember(null)}>취소</Button>
                        <Button variant="primary" onClick={handleSaveRole} disabled={saving}>
                            {saving ? <Spinner size="sm" className="me-2" /> : ""} 저장
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
}
