// PositionListPage.jsx
import { useEffect, useState } from "react";
import {
    Table,
    Button,
    Pagination,
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Alert
} from "react-bootstrap";
import axios from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function PositionListPage() {
    const [positions, setPositions] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchPositions = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axios.get(`/position/list?page=${page}&size=5`);
            setPositions(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            setError("❌ 데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, [page]);

    return (
        <Container className="py-4">
            {/* 헤더 영역 */}
            <Row className="align-items-center mb-3">
                <Col>
                    <h2>💼 직급관리 목록</h2>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="outline-secondary"
                        onClick={() => navigate("/member/position")}
                    >
                        + 새 직급 등록
                    </Button>
                </Col>
            </Row>

            {/* 카드 영역 */}
            <Card className="shadow-sm border-0 rounded-3">
                <Card.Body className="p-0">
                    {error && <Alert variant="danger">{error}</Alert>}
                    {loading ? (
                        <div className="text-center py-5 text-muted">
                            <Spinner animation="border" variant="secondary" />
                            <div className="mt-2">데이터를 불러오는 중...</div>
                        </div>
                    ) : (
                        <Table
                            hover
                            responsive
                            bordered
                            className="align-middle mb-0"
                            style={{ width: "100%", borderColor: "#dee2e6" }} // 가로 100%
                        >
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: "60px", textAlign: "center" }}>ID</th>
                                    <th style={{ width: "150px", textAlign: "center" }}>코드</th>
                                    <th style={{ width: "100px", textAlign: "center" }}>직급</th>
                                    <th>설명</th>
                                    <th style={{ width: "90px", textAlign: "center" }}>활성</th>
                                    <th style={{ width: "140px", textAlign: "center" }}>상세/수정</th>
                                </tr>
                            </thead>
                            <tbody>
                                {positions.length > 0 ? (
                                    positions.map((p) => (
                                        <tr key={p.positionId}>
                                            <td className="text-center">{p.positionId}</td>
                                            <td className="fw-semibold text-primary  text-center">{p.positionCode}</td>
                                            <td className="text-center">{p.positionName}</td>
                                            <td className="">{p.description || "-"}</td>
                                            <td className="text-center">
                                                <span
                                                    className={`badge ${p.active ? "bg-success" : "bg-secondary"
                                                        }`}
                                                >
                                                    {p.active ? "Y" : "N"}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={() =>
                                                        navigate(`/member/position/${p.positionId}`)
                                                    }
                                                >
                                                    상세/수정
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-muted">
                                            데이터가 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* 페이지네이션 */}
            <div className="d-flex justify-content-center mt-4">
                <Pagination>
                    <Pagination.Prev
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                    />
                    {[...Array(totalPages).keys()].map((p) => (
                        <Pagination.Item
                            key={p}
                            active={p === page}
                            onClick={() => setPage(p)}
                        >
                            {p + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() =>
                            setPage((prev) =>
                                Math.min(prev + 1, totalPages - 1)
                            )
                        }
                        disabled={page >= totalPages - 1}
                    />
                </Pagination>
            </div>
        </Container>
    );
}
