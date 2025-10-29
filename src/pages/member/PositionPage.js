// PositionRegisterPage.jsx
import { useContext, useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import axios from "../../api/api";
import SelectCombo from "../../sample/SelectCombo";
import { EnumContext } from "../../context/EnumContext";

export default function PositionPage() {

    const enums = useContext(EnumContext);

    const [form, setForm] = useState({
        positionCode: "",
        positionName: "",
        description: ""
    });
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/position/save", form);

            setMessage({ type: "success", text: "직급 등록 성공!" });
            setForm({ positionCode: "", positionName: "", description: "" }); // 초기화
        } catch (err) {
            setMessage({ type: "danger", text: err.response?.data || "등록 실패" });
        }
    };

    return (
        <Container style={{ maxWidth: "600px", marginTop: "50px" }}>
            <h2>직급 등록</h2>

            {message && <Alert variant={message.type}>{message.text}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>직급 코드 (영문, UNIQUE)</Form.Label>
                    {/* <SelectCombo
                        label="직급 코드 선택"
                        options={enums?.PositionCode || []}
                        value={form.positionCode}
                        onChange={(v) => handleChange(v)}
                        searchable={true}
                    /> */}
                    <Form.Control
                        type="text"
                        name="positionCode"
                        value={form.positionCode}
                        onChange={handleChange}
                        required
                        placeholder="예: INTERN, STAFF"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>직급 이름 (화면 표시용)</Form.Label>
                    <Form.Control
                        type="text"
                        name="positionName"
                        value={form.positionName}
                        onChange={handleChange}
                        required
                        placeholder="예: 인턴, 직원"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>설명</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="직급 설명 입력"
                        rows={3}
                    />
                </Form.Group>

                <Button type="submit">등록</Button>
            </Form>
        </Container>
    );
}