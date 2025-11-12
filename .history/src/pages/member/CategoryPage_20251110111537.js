import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Form, Pagination, Alert, Spinner } from "react-bootstrap";
import axios from "../../api/api";
import RadioGroup from "../../sample/RadioGroup";

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [current, setCurrent] = useState({ name: "", color: "#0d6efd", categoryId: null, active: true });
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchCategories(page);
    }, [page]);

    const fetchCategories = async (pageNumber) => {
        setLoading(true);
        try {
            const res = await axios.get(`/categories/list?page=${pageNumber}&size=5&sort=categoryId,asc`);
            setCategories(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            setError("❌ 데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!current.name) {
            setError("이름을 입력하세요.");
            return;
        }
        setError("");
        setSuccess("");

        try {
            if (current.categoryId) {
                await axios.put(`/categories/${current.categoryId}`, current);
                setSuccess("✅ 카테고리가 수정되었습니다!");
            } else {
                await axios.post("/categories", current);
                setSuccess("✅ 카테고리가 등록되었습니다!");
            }
            setShowModal(false);
            setCurrent({ name: "", color: "#0d6efd", categoryId: null, active: true });
            fetchCategories(page);
        } catch (err) {
            setError("❌ 저장 중 오류가 발생했습니다.");
        }
    };

    const handleEdit = (cat) => {
        setCurrent(cat);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("삭제하시겠습니까?")) return;
        try {
            await axios.delete(`/categories/${id}`);
            setSuccess("✅ 카테고리가 삭제되었습니다!");
            fetchCategories(page);
        } catch (err) {
            setError("❌ 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: "1100px" }}>
            {/* Header */}
            <Row className="align-items-center mb-3">
                <Col>
                    <h2>📂 카테고리 관리</h2>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowModal(true)}
                    >
                        + 새 카테고리 등록
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm border-0 rounded-3">
                <Card.Body className="p-0">
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    {loading ? (
                        <div className="text-center py-5 text-muted">
                            <Spinner animation="border" variant="secondary" />
                            <div className="mt-2">데이터를 불러오는 중...</div>
                        </div>
                    ) : (
                        <Table hover responsive className="align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: "60px" }}>ID</th>
                                    <th>이름</th>
                                    <th style={{ width: "80px" }}>색상</th>
                                    <th style={{ width: "160px" }}>액션</th>
                                    <th style={{ width: "90px" }}>활성</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <tr key={cat.categoryId}>
                                            <td className="text-muted">{cat.categoryId}</td>
                                            <td>{cat.name}</td>
                                            <td>
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        width: 30,
                                                        height: 30,
                                                        borderRadius: "50%",
                                                        backgroundColor: cat.color,
                                                        border: "1px solid #ccc"
                                                    }}
                                                ></span>
                                            </td>
                                            <td>
                                                <Button size="sm" className="me-2" onClick={() => handleEdit(cat)}>수정</Button>
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(cat.categoryId)}>삭제</Button>
                                            </td>
                                            <td>
                                                <span className={`badge ${cat.active ? "bg-success" : "bg-secondary"}`}>
                                                    {cat.active ? "Y" : "N"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-muted">
                                            데이터가 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination>
                            <Pagination.Prev
                                onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                                disabled={page === 0}
                            />
                            {[...Array(totalPages).keys()].map((p) => (
                                <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
                                    {p + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                                disabled={page >= totalPages - 1}
                            />
                        </Pagination>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{current.categoryId ? "카테고리 수정" : "카테고리 등록"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>이름</Form.Label>
                            <Form.Control
                                value={current.name}
                                onChange={e => setCurrent({ ...current, name: e.target.value })}
                            />
                        </Form.Group>
                        <Row className="mb-3">
                            <Col xs={2}>
                                <Form.Label>색상</Form.Label>
                                <Form.Control
                                    type="color"
                                    value={current.color}
                                    onChange={e => setCurrent({ ...current, color: e.target.value })}
                                    style={{ height: "38px", padding: 0 }} // 높이 맞춤
                                />
                            </Col>
                            <Col xs={10}>
                                <Form.Label className="d-block mb-1">활성</Form.Label>
                                <div className="d-flex align-items-center" style={{ height: "38px" }}>
                                    <RadioGroup
                                        label=""
                                        options={[
                                            { label: '활성', value: true },
                                            { label: '비활성', value: false }
                                        ]}
                                        value={current.active}
                                        onChange={e => setCurrent({ ...current, active: e })}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>닫기</Button>
                    <Button variant="primary" onClick={handleSave}>저장</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
