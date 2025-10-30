// src/pages/Board.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Container, Row, Col, Table, Button, Modal, Form, Pagination,
  InputGroup, FormControl, Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/config";

export default function Board() {
  const navigate = useNavigate();

  // 상태
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");  // 'ALL' | '공지사항' | '자유게시판'
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // 폼 상태 (DB 스키마 기준: createId)
  const [form, setForm] = useState({
    title: "",
    createId: "",
    content: "",
    category: "공지사항",
  });

  // 정렬 상태: key 'title' | 'date' | 'views'
  const [sorter, setSorter] = useState({ key: "date", dir: "desc" });
  const [total, setTotal] = useState(0);

  // 목록 불러오기
  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, categoryFilter, sorter]);

  async function loadPosts() {
    try {
      // 서버 정렬 키 매핑
      const keyMap = { title: "title", date: "createDate", views: "views" };
      const sortKey = keyMap[sorter.key] || "createDate";

      const params = {
        page,
        size: perPage,
        sort: `${sortKey},${sorter.dir}`,
      };
      if (query.trim()) params.q = query;
      if (categoryFilter) params.category = categoryFilter;

      const res = await axios.get(`${API_BASE_URL}/api/posts`, { params });
      setPosts(res.data.content || []);
      setTotal(res.data.totalElements || 0);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
      alert("서버에서 게시글을 가져오지 못했습니다.");
    }
  }

  // 정렬 토글
  function toggleSort(key) {
    setSorter((prev) => {
      if (prev.key === key) return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      return { key, dir: "asc" };
    });
  }
  const sortIcon = (key) => (sorter.key !== key ? "↕" : sorter.dir === "asc" ? "▲" : "▼");

  // 폼 변경
  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

<<<<<<< HEAD
  // ✅ 글 저장 (새로 작성 시 마지막 페이지로 자동 이동)
=======
  // ✅ 글 저장 (새로 작성 시 마지막 페이지로 자동 이동 + 현재 페이지면 강제 리로드)
>>>>>>> master
async function savePost() {
  if (!form.title.trim() || !form.createId.trim() || !form.content.trim()) {
    alert("제목, 작성자, 내용은 필수입니다.");
    return;
  }
  try {
    if (editingPost) {
      await axios.put(`${API_BASE_URL}/api/posts/${editingPost.id}`, form);
      alert("게시글이 수정되었습니다.");
      loadPosts();
    } else {
      await axios.post(`${API_BASE_URL}/api/posts`, form);
      alert("게시글이 등록되었습니다.");

      // ✅ 새 글 등록 후 전체 글 수 +1 기준으로 마지막 페이지 계산
      const totalAfterAdd = total + 1;
      const lastPage = Math.ceil(totalAfterAdd / perPage);
      setPage(lastPage); // 🔥 마지막 페이지로 이동
    }

    setShowModal(false);
    setEditingPost(null);
  } catch (err) {
    console.error("저장 실패:", err);
    alert("게시글 저장 중 오류가 발생했습니다.");
  }
}

  // ✅ 게시글 삭제 후 자동 새로고침 + 빈 페이지 방지
async function deletePost(id) {
  if (!window.confirm("정말 삭제하시겠습니까?")) return;
  try {
    await axios.delete(`${API_BASE_URL}/api/posts/${id}`);

    // 🔽 전체 게시글 수에서 1을 뺀 뒤, 페이지 범위 확인
    const totalAfterDelete = total - 1;
    const maxPageAfterDelete = Math.max(1, Math.ceil(totalAfterDelete / perPage));

    // ✅ 마지막 페이지에서 글이 전부 삭제되면 자동으로 이전 페이지로 이동
    if (page > maxPageAfterDelete) {
      setPage(maxPageAfterDelete);
    } else {
      loadPosts(); // ✅ 현재 페이지 새로고침
    }
  } catch (err) {
    console.error("삭제 실패:", err);
    alert("게시글 삭제 중 오류가 발생했습니다.");
  }
}

  // 모달 열기/닫기
  function openCreate() {
    setEditingPost(null);
    setForm({ title: "", createId: "", content: "", category: "공지사항" });
    setShowModal(true);
  }
  function openEdit(post) {
    setEditingPost(post);
    setForm({
      title: post.title,
      createId: post.createId,
      content: post.content,
      category: post.category || "공지사항",
    });
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
    setEditingPost(null);
  }

  // 페이지 이동
  function gotoPage(n) {
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const np = Math.max(1, Math.min(totalPages, n));
    setPage(np);
  }
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <Container className="py-4">
      {/* 상단 */}
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6}>
          <h2 className="m-0">게시판 홈</h2>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-2 mt-md-0">
          <Form.Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            style={{ width: 150, display: "inline-block", marginRight: 8 }}
          >
            <option value="ALL">전체</option>
            <option value="공지사항">공지사항</option>
            <option value="자유게시판">자유게시판</option>
          </Form.Select>

          <InputGroup style={{ maxWidth: 360, display: "inline-flex" }}>
            <FormControl
              placeholder="검색어를 입력하세요"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
            <Button
              variant="outline-secondary"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
            >
              초기화
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* 목록 */}
      <Row>
        <Col>
          <Table hover responsive>
            <thead>
              <tr>
                <th style={{ width: 100 }}>No</th>
                <th role="button" onClick={() => toggleSort("title")} className="user-select-none">
                  제목 <span className="text-muted small">{sortIcon("title")}</span>
                </th>
                <th style={{ width: 120 }}>분류</th>
                <th style={{ width: 140 }}>작성자</th>
                <th
                  role="button"
                  onClick={() => toggleSort("date")}
                  className="user-select-none"
                  style={{ width: 140 }}
                >
                 작성일 <span className="text-muted small">{sortIcon("date")}</span>
                </th>
                <th
                  role="button"
                  onClick={() => toggleSort("views")}
                  className="user-select-none"
                  style={{ width: 100 }}
                >
                  조회 <span className="text-muted small">{sortIcon("views")}</span>
                </th>
                <th style={{ width: 150 }}>액션</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    게시글이 없습니다.
                  </td>
                </tr>
              ) : (
                posts.map((p, idx) => (
                  <tr key={p.id}>
                    {/* ✅ No: 현재 페이지 첫 글부터 1씩 증가하게 표시 */}
                    <td>{(page - 1) * perPage + idx + 1}</td>

                    <td>
                      <button
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => navigate(`/board/detail/${p.id}`)}
                      >
                        <strong>{p.title}</strong>
                      </button>
                      {p.views > 100 && <Badge bg="success">인기</Badge>}
                      <div className="text-muted small text-truncate" style={{ maxWidth: 420 }}>
                        {p.content}
                      </div>
                    </td>

                    <td>{p.category}</td>
                    <td>{p.createId}</td>
                    <td>{p.createDate ? p.createDate.substring(0, 10) : "-"}</td>
                    <td>{p.views}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => openEdit(p)}
                      >
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => deletePost(p.id)}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* 페이지네이션 */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted">총 {total}건</div>
            <Pagination className="mb-0">
              <Pagination.First onClick={() => gotoPage(1)} disabled={page === 1} />
              <Pagination.Prev onClick={() => gotoPage(page - 1)} disabled={page === 1} />
              {Array.from({ length: totalPages }).map((_, idx) => {
                const num = idx + 1;
                if (Math.abs(num - page) > 3 && num !== 1 && num !== totalPages) return null;
                return (
                  <Pagination.Item key={num} active={num === page} onClick={() => gotoPage(num)}>
                    {num}
                  </Pagination.Item>
                );
              })}
              <Pagination.Next onClick={() => gotoPage(page + 1)} disabled={page === totalPages} />
              <Pagination.Last onClick={() => gotoPage(totalPages)} disabled={page === totalPages} />
            </Pagination>
          </div>
        </Col>
      </Row>

      {/* 작성/수정 모달 */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingPost ? "게시글 수정" : "새 게시글 작성"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formCategory">
              <Form.Label>분류</Form.Label>
              <Form.Select name="category" value={form.category} onChange={handleFormChange}>
                <option value="공지사항">공지사항</option>
                <option value="자유게시판">자유게시판</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>제목</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="제목"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCreateId">
              <Form.Label>작성자</Form.Label>
              <Form.Control
                name="createId"
                value={form.createId}
                onChange={handleFormChange}
                placeholder="작성자 ID (members.member_id)"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formContent">
              <Form.Label>내용</Form.Label>
              <Form.Control
                name="content"
                value={form.content}
                onChange={handleFormChange}
                as="textarea"
                rows={6}
                placeholder="내용을 입력하세요"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            취소
          </Button>
          <Button variant="primary" onClick={savePost}>
            {editingPost ? "수정 저장" : "작성 완료"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
