import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

import {
    Diversity3 as Diversity3Icon,
    EditDocument as EditDocumentIcon,
} from "@mui/icons-material";

export default function PostWrite() {
  const navigate = useNavigate();
  const location = useLocation();

  // state로 전달된 카테고리를 form의 초기값으로 설정
  const categoryFromState = location.state?.category || "공지사항"; // 기본값을 "공지사항"으로 설정

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: categoryFromState,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return "제목을 입력하세요.";
    if (!form.content.trim()) return "내용을 입력하세요.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);
    setError("");
    setSubmitting(true);

    try {
      await axios.post(`/api/posts`, form, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // ✅ 쿠키 포함해서 보내기
      });

      // 글쓰기 후, 해당 카테고리 페이지로 이동
      navigate(`/board/${form.category === "공지사항" ? "notice" : "free"}`);
    } catch (err) {
      const apiMsg =
        (err && err.response && err.response.data && err.response.data.message) ||
        (err && err.message) ||
        "등록 중 오류가 발생했습니다.";
      setError(apiMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h2>✏️ 글쓰기</h2>
        </Col>
        <Col className="text-end">
          {/* 목록으로 돌아갈 때, 해당 카테고리 페이지로 이동 */}
          <Link
            to={`/board/${form.category === "공지사항" ? "notice" : "free"}`}
            className="btn btn-outline-secondary"
          >
            목록으로
          </Link>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>게시판 종류</Form.Label>
              <Form.Select name="category" value={form.category} onChange={onChange}>
                {user.role === "ROLE_ADMIN" && (<option value="공지사항">📢 공지사항</option>)}
                <option value="자유게시판">💬 자유게시판</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>제목</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="제목을 입력하세요 (최소 1자, 최대40자)"
                maxLength={40}
                minLength={1}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>내용</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={form.content}
                onChange={onChange}
                placeholder="내용을 입력하세요"
                rows={10}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner size="sm" className="me-2" /> 저장 중...
                  </>
                ) : (
                  "등록"
                )}
              </Button>

              <Link
                to={`/board/${form.category === "공지사항" ? "notice" : "free"}`}
                className="btn btn-outline-secondary"
              >
                취소
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
