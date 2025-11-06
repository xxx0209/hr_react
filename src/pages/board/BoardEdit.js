import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import axios from "../../api/api";

export default function PostEdit() {
  const { id } = useParams();
  const location = useLocation(); // PostDetail에서 넘겨준 state 받기
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // PostDetail에서 state로 데이터 전달된 경우
    if (location.state?.post) {
      const { post } = location.state;
      setTitle(post.title);
      setContent(post.content);
    } else {
      // 직접 주소로 들어온 경우, 서버에서 다시 불러오기
      loadPost();
    }
  }, [location.state]);

  async function loadPost() {
    try {
      const res = await axios.get(`/api/posts/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
    } catch (err) {
      alert("게시글 불러오기 실패");
    }
  }

  /** ✅ 수정 저장 (UPDATE) */
  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await axios.put(`/api/posts/${id}`, { title, content }, { withCredentials: true });
      alert("게시글이 수정되었습니다.");
      navigate(`/post/${id}`); // 수정 후 상세보기로 이동
    } catch (err) {
      alert("수정 실패");
    }
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm p-4">
        <h3 className="mb-3">게시글 수정</h3>
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>제목</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>내용</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button variant="primary" type="submit">
              수정 저장
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
