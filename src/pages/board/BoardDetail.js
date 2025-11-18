import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Form, Modal } from "react-bootstrap";
import axios from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

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

  const [likedUsers, setLikedUsers] = useState([]);  // 좋아요 유저 목록
  const [showLikesModal, setShowLikesModal] = useState(false);  // 모달 상태

  // ✅ 게시글 인라인 수정용 상태
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // ✅ 인라인 댓글 수정용 상태
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const { user, setUser } = useContext(AuthContext);

  

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
     console.log("댓글 목록:", cRes.data);
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

   
  /** ✅ 게시글 인라인 수정 모드 진입 */
const startEditPost = () => {
  setIsEditingPost(true);
  setEditTitle(post.title);
  setEditContent(post.content);
};

/** ✅ 게시글 수정 취소 */
const cancelEditPost = () => {
  setIsEditingPost(false);
};

/** ✅ 게시글 수정 저장 */
const handleUpdatePost = async () => {
  if (!editTitle.trim() || !editContent.trim()) {
    alert("제목과 내용을 입력하세요.");
    return;
  }

  try {
    await axios.put(`/api/posts/${id}`, {
      title: editTitle,
      content: editContent,
    });
    alert("게시글이 수정되었습니다.");
    setIsEditingPost(false);
    loadPost(false);
  } catch (err) {
    console.error("게시글 수정 실패:", err);
    alert("게시글 수정 실패");
  }
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


  // ✅ 댓글 수정 시작
const startEditComment = (commentId, content) => {
  setEditCommentId(commentId);
  setEditCommentContent(content);
};

// ✅ 댓글 수정 취소
const cancelEdit = () => {
  setEditCommentId(null);
  setEditCommentContent("");
};

// ✅ 댓글 수정 저장
const handleCommentUpdate = async (commentId) => {
  if (!editCommentContent.trim()) {
    alert("내용을 입력하세요");
    return;
  }
  try {
    await axios.put(`/api/posts/comments/${commentId}`, { content: editCommentContent.trim() });
    alert("댓글이 수정되었습니다.");
    setEditCommentId(null);
    setEditCommentContent("");
    loadPost(false);
  } catch (err) {
    console.error("댓글 수정 실패:", err);
    alert("댓글 수정 실패");
  }
};

  /** ✅ 댓글 삭제 */
  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/posts/comments/${commentId}`);
      alert("댓글이 삭제되었습니다.");
      loadPost(false);
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제 실패");
    }
  };

  async function handleLikesClick(postId) {
    try {
        const res = await axios.get(`/api/posts/${postId}/likes`);
        setLikedUsers(res.data);  // 사용자 목록을 상태에 저장
        setShowLikesModal(true);   // 모달 열기
    } catch (err) {
        console.error("좋아요 목록 불러오기 실패:", err);
        alert("좋아요 목록을 불러오지 못했습니다.");
    }
}

  return (
    <Container className="py-4">
      <h2 className="m-0 mb-4">
        {post.category === "공지사항" ? "📢 " : "💬 "}
        {post.category}
      </h2>
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-3">
            {post.title}
            {comments.length > 0 && (
              <span style={{ fontSize: "1.3rem", color: "#777", marginLeft: "6px" }}>
                [{comments.length}]
              </span>
            )}
          </h3>
        
          <div className="text-muted mb-3" style={{ fontSize: "14px" }}>
            <strong>작성자: {post.memberName || "익명"}</strong> /{" "}
            {post.createDate?.substring(0, 10)} / 조회 {post.views ?? 0} / {""} 
            <Button
              variant="link"
              size="sm"
              onClick={() => handleLikesClick(post.id)} // 좋아요 목록 불러오기
              style={{ padding: 0, fontSize: "14px", color: "#212529BF", textDecoration: "none",  verticalAlign: "baseline" }}
              onMouseOver={(e) => {e.target.style.color = "#000000ff"; e.target.style.fontWeight = "bold";}} // hover 시 색상 변경
              onMouseOut={(e) => {e.target.style.color = "#212529BF"; e.target.style.fontWeight = "normal"}} // hover 벗어날 때 원상태로 복구
            >
               좋아요 {likes}
            </Button>
          </div>

          

          {/* ✅ 게시글 인라인 수정 모드 */}
            {isEditingPost ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>제목</Form.Label>
                  <Form.Control
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>내용</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2" style={{ marginBottom: '50px' }}>
                  <Button variant="primary" size="sm" onClick={handleUpdatePost}>
                    저장
                  </Button>
                  <Button variant="secondary" size="sm" onClick={cancelEditPost}>
                    취소
                  </Button>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}

            <div className="d-flex justify-content-between align-items-center mt-3" >
              <Button variant={liked ? "danger" : "outline-danger"} size="sm" onClick={handleLike}>
                ❤️ 좋아요 {likes}
              </Button>
                <div className="d-flex gap-2">
                  {(() => {
                    const isAdmin = user?.role === "ROLE_ADMIN";
                    const isNotice = post.category === "공지사항";
                    const isFree = post.category === "자유게시판";
                    const isPostOwner = user?.name === post.memberName; // 게시글 작성자 확인

                    // 공지사항 → 관리자만 수정, 삭제 가능
                    if (isNotice && isAdmin) {
                      return (
                        <>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={startEditPost}
                          >
                            수정
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={handleDelete}
                          >
                            삭제
                          </Button>
                        </>
                      );
                    }

                    // 자유게시판 → 작성자 본인 또는 ADMIN만 수정/삭제 가능
                    if (isFree && (isPostOwner || isAdmin)) {
                      return (
                        <>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={startEditPost}
                          >
                            수정
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={handleDelete}
                          >
                            삭제
                          </Button>
                        </>
                      );
                    }

                    return null;
                  })()}
<<<<<<< HEAD

                  <Link
                    to={`/board/${post.category === "공지사항" ? "notice" : "free"}`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    목록으로
                  </Link>
                </div>
=======
              <Link
                to={`/board/${post.category === "공지사항" ? "notice" : "free"}`}
                className="btn btn-outline-secondary btn-sm"
              >
                목록으로
              </Link>
            </div>
>>>>>>> Door-jihwan
          </div>
        </Card.Body>
      </Card>

      {/* 댓글 */}
      <div className="mt-4">
        <h6>💬 댓글 [{comments.length}]</h6>

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
               
              {editCommentId === c.id ? (
                <>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="mt-2"
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                  />
                  <div className="d-flex justify-content-end mt-2 gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCommentUpdate(c.id)}
                    >
                      저장
                    </Button>
                    <Button variant="secondary" size="sm" onClick={cancelEdit}>
                      취소
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="ms-2 mt-2">{c.content}</p>
                  <div className="d-flex justify-content-end gap-2">
                    {user?.username === c.writerId ? (
                      <>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => startEditComment(c.id, c.content)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleCommentDelete(c.id)}
                    >
                      삭제
                    </Button>
                    </>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
      <Modal show={showLikesModal} onHide={() => setShowLikesModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>좋아요 누른 사용자 목록</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {likedUsers.length > 0 ? (
            <ul>
                {likedUsers.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
        ) : (
            <p>좋아요를 누른 사용자가 없습니다.</p>
        )}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowLikesModal(false)}>
            닫기
        </Button>
    </Modal.Footer>
</Modal>
      
    </Container>
  );
}
