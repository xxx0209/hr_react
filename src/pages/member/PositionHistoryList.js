// PositionHistoryPage.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Pagination,
  Spinner,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import axios from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function PositionHistoryPage() {
  const [histories, setHistories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pageSize = 10;
  const navigate = useNavigate();

  const fetchData = async (p = 0) => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`/position/history/list?page=${p}&size=${pageSize}`);
      setHistories(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
    } catch (err) {
      setError("❌ 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrev = () => fetchData(page - 1);
  const handleNext = () => fetchData(page + 1);

  return (
    <Container className="py-4">
      {/* 헤더 영역 */}
      <Row className="align-items-center mb-3">
        <Col>
          <h2>📜 직급내역 관리</h2>
        </Col>
        <Col className="text-end">
          <Button variant="outline-secondary" onClick={() => navigate("/member/position/history/save")}>
            + 직급 변경 등록
          </Button>
        </Col>
      </Row>

      {/* 카드 영역 */}
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body className="p-0">
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center py-5 text-muted">
              <Spinner animation="border" variant="secondary" />
              <div className="mt-2">데이터를 불러오는 중...</div>
            </div>
          ) : (
            <>
              <Table
                hover
                responsive
                bordered
                className="align-middle mb-0"
                style={{ width: "100%", borderColor: "#dee2e6" }} // 가로 100%
              >
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "140px", textAlign: "center" }}>변경일자</th>
                    <th style={{ width: "120px", textAlign: "center" }}>회원아이디</th>
                    <th style={{ width: "120px", textAlign: "center" }}>회원명</th>
                    <th style={{ width: "140px", textAlign: "center" }}>이전직급명</th>
                    <th style={{ width: "140px", textAlign: "center" }}>현재직급명</th>
                    <th style={{ textAlign: "center" }}>변경사유</th>
                  </tr>
                </thead>
                <tbody>
                  {histories.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    histories.map((h) => (
                      <tr key={h.id}>
                        <td className="text-center">
                          {new Date(h.changedAt)
                            .toLocaleDateString("ko-KR")
                            .replace(/\s/g, "")
                            .slice(0, -1)}
                        </td>
                        <td className="text-center">{h.memberId}</td>
                        <td className="text-center">{h.memberName}</td>
                        <td className="text-center">{h.oldPositionName || "-"}</td>
                        <td className="text-center">{h.newPositionName}</td>
                        <td>{h.changeReason}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>
      {/* 페이지네이션 */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev
            onClick={handlePrev}
            disabled={page <= 0}
          />
          {[...Array(totalPages).keys()].map((p) => (
            <Pagination.Item
              key={p}
              active={p === page}
              onClick={() => fetchData(p)}
            >
              {p + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={handleNext}
            disabled={page >= totalPages - 1}
          />
        </Pagination>
      </div>
    </Container>
  );
}
