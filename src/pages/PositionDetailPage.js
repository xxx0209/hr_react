import { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import axios from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function PositionDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({});
    const [message, setMessage] = useState(null);

    useEffect(() => {
        axios.get(`/position/${id}`).then(res => setForm(res.data));
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/position/${id}`, form);
            setMessage({ type: "success", text: "수정 성공!" });
        } catch (err) {
            setMessage({ type: "danger", text: "수정 실패" });
        }
    };

    if (!form.positionId) return <div>로딩중...</div>;

    return (
        <Container style={{ maxWidth: "600px", marginTop: "30px" }}>
            <h2>직급 상세/수정</h2>
            {message && <Alert variant={message.type}>{message.text}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>직급 코드</Form.Label>
                    <Form.Control type="text" value={form.positionCode} disabled />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>직급 이름</Form.Label>
                    <Form.Control type="text" name="positionName" value={form.positionName} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>설명</Form.Label>
                    <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} rows={3} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check type="checkbox" label="활성 여부" name="active" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                </Form.Group>

                <Button type="submit">수정</Button>
                <Button variant="secondary" onClick={() => navigate("/position/list")} className="ms-2">목록</Button>
            </Form>
        </Container>
    );
}