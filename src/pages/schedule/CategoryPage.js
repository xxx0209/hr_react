import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Form, Pagination, Alert, Spinner, InputGroup } from "react-bootstrap";
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

    const [errors, setErrors] = useState({
        name: "", color: "#0d6efd", active: true
    });

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
            setErrors({ name: "이름을 입력하세요." });
            return;
        }
        if (!current.name) {
            setErrors({ name: "이름을 입력하세요." });
            return;
        }
        setError("");
        setErrors([]);
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
        setErrors([]);
        setError(null);
        setSuccess(null);
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
                        onClick={() => {
                            setCurrent({ name: "", color: "#0d6efd", categoryId: null, active: true });
                            setShowModal(true)
                        }}
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
                                    <th style={{ textAlign: "center" }}>이름</th>
                                    <th style={{ width: "80px", textAlign: "center" }}>색상</th>
                                    <th style={{ width: "90px", textAlign: "center" }}>활성</th>
                                    <th style={{ width: "140px", textAlign: "center" }}>액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <tr key={cat.categoryId}>
                                            <td className="text-center">{cat.categoryId}</td>
                                            <td className="text-center">{cat.name}</td>
                                            <td className="text-center">
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
                                            <td className="text-center">
                                                <span className={`badge ${cat.active ? "bg-success" : "bg-secondary"}`}>
                                                    {cat.active ? "Y" : "N"}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <Button size="sm" className="me-2" onClick={() => handleEdit(cat)}>수정</Button>
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(cat.categoryId)}>삭제</Button>
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


                </Card.Body>
            </Card>

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

            {/* Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {current.categoryId ? "카테고리 수정" : "카테고리 등록"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>

                        {/* 이름 */}
                        <Form.Group className="mb-4">
                            <Form.Label>이름</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    placeholder="카테고리 이름을 입력하세요"
                                    value={current.name}
                                    onChange={(e) => {
                                        setCurrent({ ...current, name: e.target.value });
                                        setErrors(prev => ({ ...prev, name: "" }));
                                    }}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        {/* 색상 + 활성 상태 */}
                        <Row className="align-items-center mb-3">
                            <Col xs={3}>
                                <Form.Label className="fw-semibold">색상</Form.Label>
                            </Col>
                            <Col xs={9}>
                                <div className="d-flex align-items-center" style={{ gap: 12 }}>
                                    <Form.Control
                                        type="color"
                                        value={current.color}
                                        onChange={e =>
                                            setCurrent({ ...current, color: e.target.value })
                                        }
                                        style={{
                                            width: 45,
                                            height: 38,
                                            padding: 2,
                                            cursor: "pointer"
                                        }}
                                    />
                                    <span className="text-muted" style={{ fontSize: "12px" }}>
                                        {current.color.toUpperCase()}
                                    </span>
                                </div>
                            </Col>
                        </Row>

                        <Row className="align-items-center mb-3">
                            <Col xs={3}>
                                <Form.Label className="fw-semibold">활성 상태</Form.Label>
                            </Col>
                            <Col xs={9}>
                                <div className="d-flex" style={{ gap: 18 }}>
                                    <Form.Check
                                        inline
                                        type="radio"
                                        label="활성"
                                        name="activeStatus"
                                        checked={current.active === true}
                                        onChange={() => setCurrent({ ...current, active: true })}
                                    />
                                    <Form.Check
                                        inline
                                        type="radio"
                                        label="비활성"
                                        name="activeStatus"
                                        checked={current.active === false}
                                        onChange={() => setCurrent({ ...current, active: false })}
                                    />
                                </div>
                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container >
    );
}
