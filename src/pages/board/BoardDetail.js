import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Form } from "react-bootstrap";
import axios from "../../api/api";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  

  const loginId = localStorage.getItem("loginId");

  useEffect(() => {
    loadPost(); // 페이지 진입 시 조회수 포함 불러오기
  }, [id]);

  /** ✅ 게시글 + 댓글 불러오기 */
  async function loadPost(view = true) {
  try {
    const res = await axios.get(`/api/posts/${id}`, {
      params: { view },
      withCredentials: true,
    });
    setPost(res.data.post);
    setLikes(res.data.post.likes ?? 0);
    setLiked(res.data.liked ?? false);

    // 댓글 목록 불러오기
    const cRes = await axios.get(`/api/posts/${id}/comments`);
    setComments(cRes.data || []);
  } catch (e) {
    setError("게시글을 불러오지 못했습니다.");
  } finally {
    setLoading(false);
  }
}

async function handleCommentSubmit(e) {
  e.preventDefault();
  if (!comment.trim()) {
    alert("댓글을 입력하세요");
    return;
  }

  try {
    await axios.post(`/api/posts/${id}/comments`, {
      writer: loginId || "익명",
      content: comment.trim(),
    });
    setComment("");
    loadPost(false); // 댓글 등록 후 조회수 증가 방지
  } catch (err) {
    console.error("❌ 댓글 등록 실패:", err);
    alert("댓글 등록 실패");
  }
}

async function handleLike() {
  try {
    const res = await axios.post(`/api/posts/${id}/like`, {}, { withCredentials: true });
    const likedNow = res.data.liked;
    setLiked(likedNow);
    setLikes((prev) => (likedNow ? prev + 1 : prev - 1));
  } catch {
    alert("좋아요 처리 중 오류 발생");
  }
}
  if (loading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="py-5 text-center">
        <p className="text-danger">{error}</p>
      </Container>
    );

  if (!post)
    return (
      <Container className="py-5 text-center">
        <p>게시글이 없습니다.</p>
      </Container>
    );

     /** ✅ 수정 페이지 이동 */
  const handleEdit = () => {
    if (!post) return;
    navigate(`/post/edit/${id}`, { state: { post } });
  };

   /** ✅ 게시글 삭제 */
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/posts/${id}`, { withCredentials: true });
      alert("게시글이 삭제되었습니다.");
      navigate(`/board/${post.category === "공지사항" ? "notice" : "free"}`);
    } catch (err) {
      console.error("삭제 중 오류 발생:", err);
      alert("삭제 실패");
    }
  };

  return (
    <Container className="py-4">
      <h2 className="m-0 mb-4">{post.category}</h2>
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-3">{post.title}</h3>

          <div className="text-muted mb-3" style={{ fontSize: "14px" }}>
            <strong>작성자: {post.memberName || "익명"}</strong> /{" "}
            {post.createDate?.substring(0, 10)} / 조회 {post.views ?? 0} / 좋아요 {likes}
          </div>

          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "8px",
              backgroundColor: "#fafafa",
              padding: "16px 20px",
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#222",
              whiteSpace: "pre-line",
              marginBottom: "15px",
            }}
          >
            {post.content}
          </div>

            <div className="d-flex justify-content-between align-items-center">
              <Button variant={liked ? "danger" : "outline-danger"} size="sm" onClick={handleLike}>
                ❤️ 좋아요 {likes}
              </Button>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={''}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={''}
                  >
                    삭제
                  </Button>
              <Link
                to={`/board/${post.category === "공지사항" ? "notice" : "free"}`}
                className="btn btn-outline-secondary btn-sm"
              >
                목록으로
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* 댓글 */}
      <div className="mt-4">
        <h6>💬 댓글 ({comments.length})</h6>

        <Form onSubmit={handleCommentSubmit} className="mb-3">
          <Form.Group controlId="comment">
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="댓글을 입력하세요"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button type="submit" variant="primary" size="sm" className="mt-2">
              등록
            </Button>
          </div>
        </Form>

        {comments.length === 0 ? (
          <p className="text-muted">아직 댓글이 없습니다.</p>
        ) : (
          comments.map((c, idx) => (
            <div key={idx} className="border-bottom py-2">
              <strong>{c.writer}</strong> ·{" "}
                <span className="text-muted" style={{ fontSize: "12px" }}>
                  {c.createDate?.substring(0, 10)}
               </span>
                <p className="mb-1">{c.content}</p>
                  <div className="d-flex justify-content-end">
                    <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={''}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={''}
                  >
                    삭제
                  </Button>
                  </div>
                 </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}
