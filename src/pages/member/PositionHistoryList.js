import React, { useEffect, useState } from "react";
import { Table, Button, Pagination, Spinner } from "react-bootstrap";
import axios from "../../api/api";

export default function PositionHistoryPage() {
  const [histories, setHistories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const fetchData = (p = 0) => {
    setLoading(true);
    axios
      .get(`/position/history/list?page=${p}&size=${pageSize}`)
      .then((res) => {
        setHistories(res.data.content);
        setTotalPages(res.data.totalPages);
        setPage(res.data.number);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrev = () => fetchData(page - 1);
  const handleNext = () => fetchData(page + 1);

  const renderPagination = () => (
    <Pagination className="justify-content-center mt-3">
      <Pagination.Prev onClick={handlePrev} disabled={page <= 0} />
      <Pagination.Item active>{page + 1}</Pagination.Item>
      <Pagination.Next onClick={handleNext} disabled={page >= totalPages - 1} />
    </Pagination>
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-3">직급 변경 이력</h3>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>변경일자</th>
                <th>회원아이디</th>
                <th>회원명</th>
                <th>이전직급아이디</th>
                <th>이전직급</th>
                <th>직급아이디</th>
                <th>변경직급</th>
                <th>변경사유</th>
              </tr>
            </thead>
            <tbody>
              {histories.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                histories.map((h) => (
                  <tr key={h.id}>
                    <td>{new Date(h.changedAt)
                      .toLocaleDateString("ko-KR")
                      .replace(/\s/g, "")   // 공백 제거
                      .slice(0, -1)}
                    </td>
                    <td>{h.memberId}</td>
                    <td>{h.memberName}</td>
                    <td>{h.oldPositionId || "-"}</td>
                    <td>{h.oldPositionName || "-"}</td>
                    <td>{h.newPositionId}</td>
                    <td>{h.newPositionName}</td>
                    <td>{h.changeReason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {renderPagination()}
        </>
      )}
    </div>
  );
}