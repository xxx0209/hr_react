import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import axios from "../../api/api";
import { FaClipboardList, FaComments } from "react-icons/fa"; // 아이콘 추가
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 추가

export default function BoardPage() {
  const [posts, setPosts] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("공지사항"); // 기본값: 공지사항 게시판
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 게시글 조회 함수 (게시판에 따라 데이터 로딩)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/posts?category=${selectedBoard}`);
        const data = response.data.content || [];
        setPosts(data.slice(0, 3)); // 게시글 최대 2개만 표시
      } catch (err) {
        console.error("게시글 조회 실패:", err);
      }
    };

    fetchPosts();
  }, [selectedBoard]); // selectedBoard가 변경될 때마다 게시글 목록을 가져옵니다.

  // 게시글 클릭 시 해당 상세 페이지로 이동하는 함수
  const handleSelectPost = (postId) => {
    navigate(`/board/detail/${postId}`); // 클릭한 게시글의 상세 페이지로 이동
  };

  // 게시판 선택 함수
  const handleBoardSelect = (boardName) => {
    setSelectedBoard(boardName); // 클릭한 게시판의 이름으로 상태를 변경
  };

  return (
    <Container className="py-4">
      {/* 게시판 제목만 왼쪽 정렬 */}
      <Row className="mb-0">
        <Col className="text-start">
          <h5>📋 게시판 최근글</h5>
        </Col>
      </Row>

      {/* 기능 : 게시판 종류에 따른 목록 변환 */}
      <Row className="mb-1">
        <Col className="d-flex justify-content-center">
          {/* 첫 번째 버튼 */}
          <Col xs={5} className="d-flex justify-content-center">
            <Button
              variant="link"
              className={`d-flex align-items-center w-100 ${selectedBoard === "공지사항" ? "text-dark" : "text-muted"}`}
              style={{ 
                justifyContent: "center",
                textDecoration: selectedBoard === "공지사항" ? "underline" : "none", // 선택된 버튼에만 밑줄 추가
                padding: "10px 20px",
                fontWeight: selectedBoard === "공지사항" ? "bold" : "normal",
                transition: "all 0.3s ease",
              }}
              onClick={() => handleBoardSelect("공지사항")}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"} // 마우스 올릴 때 밑줄 추가
              onMouseLeave={(e) => e.target.style.textDecoration = selectedBoard === "공지사항" ? "underline" : "none"} // 마우스 뗄 때 원래 상태로 돌아오기
            >
              <FaClipboardList size={20} className="me-2" />
              공지사항
            </Button>
          </Col>

          {/* 두 번째 버튼 */}
          <Col xs={5} className="d-flex justify-content-center">
            <Button
              variant="link"
              className={`d-flex align-items-center w-100 ${selectedBoard === "자유게시판" ? "text-dark" : "text-muted"}`}
              style={{
                justifyContent: "center",
                textDecoration: selectedBoard === "자유게시판" ? "underline" : "none", // 선택된 버튼에만 밑줄 추가
                padding: "10px 20px",
                fontWeight: selectedBoard === "자유게시판" ? "bold" : "normal",
                transition: "all 0.3s ease",
              }}
              onClick={() => handleBoardSelect("자유게시판")}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"} // 마우스 올릴 때 밑줄 추가
              onMouseLeave={(e) => e.target.style.textDecoration = selectedBoard === "자유게시판" ? "underline" : "none"} // 마우스 뗄 때 원래 상태로 돌아오기
            >
              <FaComments size={20} className="me-2" />
              자유게시판
            </Button>
          </Col>
        </Col>
      </Row>

      {/* 게시글 목록 - 리스트 형식 */}
      <Row className="g-4">
        {posts.length === 0 ? (
          <Col className="text-center">
            <p>게시글이 없습니다.</p>
          </Col>
        ) : (
          <Col md={12}>
            <ListGroup>
              {posts.map((post) => (
                <ListGroup.Item
                  className="text-start"
                  key={post.id}
                  action
                  onClick={() => handleSelectPost(post.id)} // 게시글 클릭 시 상세 페이지로 이동
                  style={{ cursor: "pointer" }}
                >
                  <Row>
                    <Col xs={12} className="fw-bold" style={{ fontSize: "14px" }}>
                        {post.title.length > 20 ? `${post.title.substring(0, 20)} ...` : post.title}
                        {post.commentCount > 0 && (
                        <span style={{ color: "##212529BF" }}>
                          [{post.commentCount}]
                        </span>
                      )}</Col>
                    <Col xs={12} className="text-muted text-end">
                        {post.memberName}
                        {" /"} {new Date(post.createDate).toLocaleDateString('ko-KR')}
                        </Col>
                        {/* {" /"} 조회 {post.views ?? 0} 
                        {" /"} 좋아요 {post.likes ?? 0} */}
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        )}
      </Row>
    </Container>
  );
}
