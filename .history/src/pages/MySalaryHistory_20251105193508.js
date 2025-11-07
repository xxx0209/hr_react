// MySalaryHistory.jsx
import React, { useEffect, useState } from "react";
import { Table, Form, Row, Col } from "react-bootstrap";
import axios from "../api/api"; // axios 인스턴스

export default function MySalaryHistory() {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [filters, setFilters] = useState({ salaryMonth: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMySalaries();
  }, []);

  const fetchMySalaries = async () => {
    try {
      const res = await axios.get("/api/salaries/me"); // 로그인 회원 전용
      setSalaries(res.data);
      setFilteredSalaries(res.data);
    } catch (err) {
      console.error("급여 조회 실패", err);
      setError("급여 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const filtered = salaries.filter((s) => {
      let salaryMonth = s.salaryMonth
        ? s.salaryMonth
        : s.payDate
        ? s.payDate.slice(0, 7)
        : "";

      return newFilters.salaryMonth ? salaryMonth === newFilters.salaryMonth : true;
    });

    setFilteredSalaries(filtered);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (salaries.length === 0) return <div>등록된 급여 내역이 없습니다.</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📝 나의 급여 내역</h3>

      {/* 필터 */}
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>급여월 선택</Form.Label>
              <Form.Control
                type="month"
                name="salaryMonth"
                value={filters.salaryMonth}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {/* 급여 테이블 */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>급여월</th>
            <th>지급일</th>
            <th>총 급여</th>
            <th>총 공제</th>
            <th>실 수령액</th>
            <th>상태</th>
            <th>상세보기</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalaries.map((s) => (
            <tr key={s.salaryId}>
              <td>{s.salaryId}</td>
              <td>{s.salaryMonth || (s.payDate ? s.payDate.slice(0, 7) : "-")}</td>
              <td>{s.payDate || "-"}</td>
              <td>{s.grossPay?.toLocaleString()}원</td>
              <td>{s.totalDeduction?.toLocaleString()}원</td>
              <td>{s.netPay?.toLocaleString()}원</td>
              <td>{s.status}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => alert(JSON.stringify(s, null, 2))}
                >
                  상세보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
