import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import axios from "../../api/api";
import RadioGroup from "../../sample/RadioGroup";

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [current, setCurrent] = useState({ name: "", color: "#0d6efd", categoryId: null });
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchCategories(page);
    }, [page]);

    const fetchCategories = async (pageNumber) => {
        const res = await axios.get(`/categories/list?page=${pageNumber}&size=5&sort=categoryId,asc`);
        setCategories(res.data.content);
        setTotalPages(res.data.totalPages);
    };

    const handleSave = async () => {
        if (!current.name) return alert("이름을 입력하세요");

        if (current.categoryId) {
            await axios.put(`/categories/${current.categoryId}`, current);
        } else {
            await axios.post("/categories", current);
        }
        setShowModal(false);
        setCurrent({ name: "", color: "#0d6efd", categoryId: null });
        fetchCategories(page);
    };

    const handleEdit = (cat) => {
        setCurrent(cat);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("삭제하시겠습니까?")) return;
        await axios.delete(`/categories/${id}`);
        fetchCategories(page);
    };

    return (
        <Container className="mt-5">
            <Row className="mb-3">
                <Col>
                    <Button onClick={() => setShowModal(true)}>카테고리 등록</Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>이름</th>
                                <th>색상</th>
                                <th>액션</th>
                                <th>활성</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat.categoryId}>
                                    <td>{cat.categoryId}</td>
                                    <td>{cat.name}</td>
                                    <td>
                                        <div style={{ backgroundColor: cat.color, width: 50, height: 20 }}></div>
                                    </td>
                                    <td>
                                        <Button onClick={() => handleEdit(cat)} className="me-2">수정</Button>
                                        <Button variant="danger" onClick={() => handleDelete(cat.categoryId)}>삭제</Button>
                                    </td>
                                    <td>{cat.active ? "Y" : "N"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* <Pagination>{paginationItems}</Pagination> */}
                    <div className="d-flex justify-content-center">
                        <Pagination>
                            <Pagination.Prev onClick={() => setPage(prev => Math.max(prev - 1, 0))} />
                            {[...Array(totalPages).keys()].map(p => (
                                <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>{p + 1}</Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))} />
                        </Pagination>
                    </div>
                </Col>
            </Row>

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
                        <Form.Group className="mb-3">
                            <Form.Label>색상</Form.Label>
                            <Form.Control
                                type="color"
                                value={current.color}
                                onChange={e => setCurrent({ ...current, color: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <RadioGroup
                                label="활성"
                                options={[{ label: '활성', value: true }, { label: '비활성', value: false }]}
                                value={current.active}
                                onChange={(e) => setCurrent({ ...current, active: e })}
                            />
                            {/* <Form.Check type="checkbox" label="활성 여부" name="active" checked={current.active} onChange={e => setCurrent({ ...current, active: e.target.checked })} /> */}
                        </Form.Group>
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