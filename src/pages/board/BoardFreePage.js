import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Table, Button, Form, InputGroup, Pagination, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../../api/api";

const PER_PAGE = 10;

const styles = {
  wrap: { paddingTop: 12, paddingBottom: 12 },
  topBar: { borderBottom: "1px solid #ddd", paddingBottom: 8, marginBottom: 8 },
  topTitle: { fontSize: 14, color: "#333" },
  writeLink: {
    background: "none",
    border: 0,
    padding: 0,
    fontSize: 14,
    color: "#333",
    cursor: "pointer",
  },
  th: {
    background: "#f6f6f6",
    color: "#333",
    borderColor: "#e5e5e5",
    textAlign: "center",
    verticalAlign: "middle",
    height: 38,
    padding: 8,
    fontSize: 14,
  },
  td: {
    borderColor: "#eee",
    verticalAlign: "middle",
    height: 44,
    padding: "8px 10px",
    fontSize: 14,
  },
  no: { width: 80, textAlign: "center" },
  author: { width: 140, textAlign: "center" },
  date: { width: 110, textAlign: "center" },
  views: { width: 90, textAlign: "center" },
  likes: { width: 90, textAlign: "center" },
  titleCell: { whiteSpace: "nowrap" },
  titleBtn: {
    background: "none",
    border: 0,
    padding: 0,
    color: "#111",
    textDecoration: "none",
    cursor: "pointer",
  },
  titleText: { marginLeft: 4 },
  bottomRow: { marginTop: 8 },
  select: { minWidth: 120 },
  searchInput: { height: 31 },
};

function fmtDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function  NoticeBoard() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [field, setField] = useState("title+content");
  const [q, setQ] = useState("");

  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function load() {
    try {
      const params = {
        page: page - 1,
        size: PER_PAGE,
        sort: "createDate,desc",
        category: "자유게시판",
      };
      if (q.trim()) params.q = q.trim();
      const res = await axios.get(`/api/posts`, { params });
      const list = res?.data?.content || [];
      setRows(list);
      setTotal(res?.data?.totalElements ?? list.length);
    } catch (e) {
      console.error(e);
      alert("게시글을을 불러오지 못했습니다.");
    }
  }

  const data = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.trim().toLowerCase();
    return rows.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const content = (p.content || "").toLowerCase();
      const author = (p.createId || "").toLowerCase();
      if (field === "title") return title.includes(needle);
      if (field === "content") return content.includes(needle);
      if (field === "createId") return author.includes(needle);
      return title.includes(needle) || content.includes(needle);
    });
  }, [rows, q, field]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const goWrite = () => {
    navigate("/board/write", { state: { category: "자유게시판" } }); // 글쓰기 페이지로 카테고리 넘기기
  };

  async function handleLikesClick(postId) {
    try {
          const res = await axios.get(`/api/posts/${postId}/likes`);
          setLikedUsers(res.data);
          setShowLikesModal(true); // 모달 열기
        } catch (err) {
          console.error("좋아요 목록 불러오기 실패:", err);
          alert("좋아요 목록을 불러오지 못했습니다.");
        }
  }
  
  return (
    <Container style={styles.wrap}>
      {/* 상단 */}
      <h2 className="m-0 mb-4">💬 자유게시판</h2>
      <Row className="align-items-center" style={styles.topBar}>
        <Col>
          <button style={styles.writeLink} onClick={goWrite}>
            <span className="me-1">✏️</span> 글쓰기
          </button>
        </Col>
      </Row>
      <Row className="align-items-center" style={styles.topBar}>
            {/*: 검색 칸 */}
            <Col xs="auto">
                <Form.Select
                  size="sm"
                  style={styles.select}
                  value={field}
                  onChange={(e) => {
                    setField(e.target.value);
                  }}
                >
                  <option value="title+content">제목+내용</option>
                  <option value="title">제목</option>
                  <option value="content">내용</option>
                  <option value="createId">작성자</option>
                </Form.Select>
              </Col>
      
              <Col xs={12} sm={5} md={4}>
                <InputGroup size="sm">
                  <Form.Control
                    placeholder="검색"
                    style={styles.searchInput}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setPage(1);
                        load();
                      }
                    }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setPage(1);
                      load();
                    }}
                  >
                    검색
                  </Button>
                </InputGroup>
              </Col>
            </Row>

      {/* 목록 */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th style={{ ...styles.th, ...styles.no }}>번호</th>
            <th style={styles.th}>제목</th>
            <th style={{ ...styles.th, ...styles.author }}>작성자</th>
            <th style={{ ...styles.th, ...styles.date }}>작성일</th>
            <th style={{ ...styles.th, ...styles.views }}>조회</th>
            <th style={{ ...styles.th, ...styles.likes }}>좋아요</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} style={styles.td} className="text-center text-muted">
                게시글이 없습니다.
              </td>
            </tr>
          ) : (
            data.map((p, idx) => (
              <tr key={p.id}>
                <td style={{ ...styles.td, ...styles.no }}>
                  {total - (page - 1) * PER_PAGE - idx}
                </td>
                <td style={{ ...styles.td, ...styles.titleCell }}>
                  <button
                    style={styles.titleBtn}
                    onClick={() => navigate(`/board/detail/${p.id}`)}
                    title={p.title}
                  >
                    <span style={styles.titleText}>
                      {p.title}
                      {p.commentCount > 0 && (
                        <span style={{ color: "#111", fontSize: "14px" }}> ({p.commentCount})</span>
                      )}
                    </span>
                  </button>
                </td>
                <td style={{ ...styles.td, ...styles.author }}>{p.memberName || "-"}</td>
                <td style={{ ...styles.td, ...styles.date }}>{fmtDate(p.createDate)}</td>
                <td style={{ ...styles.td, ...styles.views }}>{p.views ?? 0}</td>
                <td style={{ ...styles.td, ...styles.likes, cursor: "pointer", color: "#000000ff" }}
                    onClick={() => handleLikesClick(p.id)}
                >
                  {p.likes ?? 0}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* 하단: 검색 + 페이지네이션 */}
      <Row className="gy-2 align-items-center" style={styles.bottomRow}>
        

        <Col className="d-flex justify-content-center">
          <Pagination className="mb-0">
            <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
            <Pagination.Prev
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            />
            <Pagination.Item active>{page}</Pagination.Item>
            <Pagination.Next
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            />
            <Pagination.Last
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            />
          </Pagination>
        </Col>
      </Row>

      <Modal
        show={showLikesModal}
        onHide={()=>setShowLikesModal(false)}
        centerd
        backdrop={false}
        style={{
          backdropFilter: "none"
        }}
        >
        <Modal.Header closeButton>
          <Modal.Title>❤️ 좋아요를 누른사람 </Modal.Title>
        </Modal.Header>
          <Modal.Body>
            {likedUsers.length === 0 ? (
              <p className="text-muted" style={{ margin: 0, fontSize: "14px" }}>
                좋아요 목록이 없습니다.
              </p>
            ) : (
              <ul style={{ margin: "6px 0", paddingLeft: "18px" }}>
                {likedUsers.map((user, idx) => (
                  <li key={idx} style={{ fontSize: "14px" }}>
                    {user}
                  </li>
                ))}
              </ul>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" size="sm" onClick={() => setShowLikesModal(false)}>
              닫기
            </Button>
          </Modal.Footer>
      </Modal>  
    </Container>
  );
}
