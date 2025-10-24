/*
React + React-Bootstrap 기본 게시판 컴포넌트
사용법:
1) 의존성 설치:
   npm install react-bootstrap bootstrap
2) index.js 또는 App 진입점에 Bootstrap CSS 추가:
   import 'bootstrap/dist/css/bootstrap.min.css';
3) 이 파일을 프로젝트에 추가하고 App에서 import Board from './React-Board-ReactBootstrap'; 사용

설명: 게시글 목록, 검색, 페이징, 글 생성/수정 모달, 삭제 기능이 포함된 기본 예시입니다. 필요한 부분을 자유롭게 확장하세요.
*/

import React, { useState, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Pagination,
  InputGroup,
  FormControl,
  Badge,
} from 'react-bootstrap';

export default function Board() {
  // 샘플 데이터
  const initialPosts = Array.from({ length: 13 }).map((_, i) => ({
    id: i + 1,
    title: `샘플 게시글 #${i + 1}`,
    author: `작성자${(i % 4) + 1}`,
    content: `이것은 샘플 본문입니다. 게시글 번호 ${i + 1}입니다.`,
    date: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toLocaleDateString(),
    views: Math.floor(Math.random() * 200),
  }));

  const [posts, setPosts] = useState(initialPosts);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  // 모달 상태 (작성/수정)
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // 폼 필드 상태
  const [form, setForm] = useState({ title: '', author: '', content: '' });

  // 필터링된 결과
  const filtered = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
    );
  }, [posts, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  function openCreate() {
    setEditingPost(null);
    setForm({ title: '', author: '', content: '' });
    setShowModal(true);
  }

  function openEdit(post) {
    setEditingPost(post);
    setForm({ title: post.title, author: post.author, content: post.content });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingPost(null);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function savePost() {
    if (!form.title.trim() || !form.author.trim()) {
      alert('제목과 작성자는 필수입니다.');
      return;
    }

    if (editingPost) {
      // 수정
      setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? { ...p, ...form } : p)));
    } else {
      // 생성
      const nextId = posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
      const newPost = {
        id: nextId,
        title: form.title,
        author: form.author,
        content: form.content,
        date: new Date().toLocaleDateString(),
        views: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
      // 생성 후 첫 페이지로 이동
      setPage(1);
    }

    closeModal();
  }

  function deletePost(id) {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  function gotoPage(n) {
    const np = Math.max(1, Math.min(totalPages, n));
    setPage(np);
  }

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6}>
          <h2 className="m-0">게시판 홈</h2>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-2 mt-md-0">
          <InputGroup style={{ maxWidth: 360, display: 'inline-flex' }}>
            <FormControl
              placeholder="검색어를 입력하세요"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
            <Button variant="outline-secondary" onClick={() => setQuery('')}>초기화</Button>
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table hover responsive>
            <thead>
              <tr>
                <th style={{ width: 70 }}>No</th>
                <th>제목</th>
                <th style={{ width: 140 }}>작성자</th>
                <th style={{ width: 120 }}>날짜</th>
                <th style={{ width: 100 }}>조회</th>
                <th style={{ width: 150 }}>액션</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted">게시글이 없습니다.</td>
                </tr>
              ) : (
                pageData.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <strong>{p.title}</strong>
                        {p.views > 100 && <Badge bg="success">인기</Badge>}
                      </div>
                      <div className="text-muted small text-truncate" style={{ maxWidth: 400 }}>{p.content}</div>
                    </td>
                    <td>{p.author}</td>
                    <td>{p.date}</td>
                    <td>{p.views}</td>
                    <td>
                      <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openEdit(p)}>수정</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => deletePost(p.id)}>삭제</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted">총 {filtered.length}건</div>
            <Pagination className="mb-0">
              <Pagination.First onClick={() => gotoPage(1)} disabled={page === 1} />
              <Pagination.Prev onClick={() => gotoPage(page - 1)} disabled={page === 1} />

              {/* 페이지 번호 간단 렌더링: 현재 페이지 중심으로 +/-2 */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const num = idx + 1;
                if (Math.abs(num - page) > 3 && num !== 1 && num !== totalPages) return null;
                return (
                  <Pagination.Item key={num} active={num === page} onClick={() => gotoPage(num)}>{num}</Pagination.Item>
                );
              })}

              <Pagination.Next onClick={() => gotoPage(page + 1)} disabled={page === totalPages} />
              <Pagination.Last onClick={() => gotoPage(totalPages)} disabled={page === totalPages} />
            </Pagination>
          </div>
        </Col>
      </Row>

      {/* Create / Edit Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingPost ? '게시글 수정' : '새 게시글 작성'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>제목</Form.Label>
              <Form.Control name="title" value={form.title} onChange={handleFormChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAuthor">
              <Form.Label>작성자</Form.Label>
              <Form.Control name="author" value={form.author} onChange={handleFormChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formContent">
              <Form.Label>내용</Form.Label>
              <Form.Control name="content" value={form.content} onChange={handleFormChange} as="textarea" rows={6} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>취소</Button>
          <Button variant="primary" onClick={savePost}>{editingPost ? '수정 저장' : '작성 완료'}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
