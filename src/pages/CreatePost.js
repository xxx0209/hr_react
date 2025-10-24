import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    content: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.title || !form.author || !form.content) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    
    // 백엔드에 제출할 데이터 (API 연동 예정)
    console.log("게시글 작성 데이터:", form);
    
    // 작성 완료 후 게시판 목록 페이지로 돌아가기
    navigate("/post/list");
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h3>게시글 작성</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>제목</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="게시글 제목"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAuthor">
              <Form.Label>작성자</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={form.author}
                onChange={handleInputChange}
                placeholder="작성자 이름"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formContent">
              <Form.Label>내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="content"
                value={form.content}
                onChange={handleInputChange}
                placeholder="게시글 내용을 입력하세요"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              게시글 작성
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreatePost;
