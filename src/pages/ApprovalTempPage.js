// 📁 src/pages/ApprovalTempPage.js
import React, { useEffect, useState } from "react";
import { Container, Table, Badge } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../config/config";

export default function ApprovalTempPage() {
  const [temps, setTemps] = useState([]);

  useEffect(() => {
    fetchTempRequests();
  }, []);

  const fetchTempRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/requests`);
      const filtered = res.data.filter((r) => r.status === "임시저장");
      setTemps(filtered);
    } catch (err) {
      console.error("임시보관함 조회 실패:", err);
    }
  };

  return (
    <Container className="py-4">
      <h3>📂 임시보관함</h3>
      <Table hover responsive bordered className="mt-3">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>작성자 ID</th>
            <th>종류</th>
            <th>기간</th>
            <th>내용</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {temps.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                임시저장된 문서가 없습니다.
              </td>
            </tr>
          ) : (
            temps.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.member?.id || r.memberId}</td>
                <td>{r.requestType}</td>
                <td>{r.startDate?.slice(0, 10)} ~ {r.endDate?.slice(0, 10)}</td>
                <td>{r.content}</td>
                <td><Badge bg="warning">{r.status}</Badge></td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}
