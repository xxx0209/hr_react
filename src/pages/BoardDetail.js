import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/config";

export default function BoardDetail() {
  const { id } = useParams(); // URL에서 게시글 ID를 가져옴
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/posts/${id}`);
        setPost(res.data);
        setLoading(false);
      } catch (err) {
        setError("게시글을 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);
  

  // 좋아요 증가
  const increaseLikes = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/posts/${id}/like`);
      setPost((prevPost) => ({
        ...prevPost,
        likes: prevPost.likes + 1,
      }));
    } catch (err) {
      console.error("좋아요 업데이트 실패:", err);
      alert("좋아요 업데이트 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Spinner animation="border" variant="primary" />
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Row>
          <Col>
            <Card className="text-center">
              <Card.Body>{error}</Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col xs={12} md={8} className="offset-md-2">
          <Card>
            <Card.Header>
              <Row>
                <Col>
                  <h2>{post.title}</h2>
                  <p className="text-muted small">
                    작성자: {post.createId} | 작성일: {post.createDate}
                  </p>
                </Col>
                <Col className="text-end">
                  <Button variant="outline-primary" onClick={() => navigate("/board")}>
                    목록으로
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <div>{post.content}</div>
              <div className="mt-3">
                <Button variant="outline-success" onClick={increaseLikes}>
                  👍 좋아요 {post.likes}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
