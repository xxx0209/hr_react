import React, { useEffect, useState } from "react";
import { Table, Form, Row, Col } from "react-bootstrap";
import axios from "../api/api";

export default function CompletedSalaries() {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({ memberId: "", salaryMonth: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, salariesRes] = await Promise.all([
        axios.get("/member/list"),
        axios.get("/api/salaries/completed"),
      ]);
      setMembers(membersRes.data);
      setList(salariesRes.data);
      setFilteredList(salariesRes.data); // 초기에는 전체
    } catch (err) {
      console.error("데이터 로딩 실패", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const filtered = list.filter((s) => {
      // 회원 필터
      const matchMember = newFilters.memberId
        ? String(s.memberId) === newFilters.memberId
        : true;

      // 월별 필터
      let salaryMonth = "";
      if (s.salaryMonth) {
        salaryMonth = s.salaryMonth; // 이미 YYYY-MM 형식이면 그대로 사용
      } else if (s.payDate) {
        salaryMonth = s.payDate.slice(0, 7); // YYYY-MM-20 -> YYYY-MM
      }

      const matchMonth = newFilters.salaryMonth
        ? salaryMonth === newFilters.salaryMonth
        : true;

      return matchMember && matchMonth;
    });

    setFilteredList(filtered);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">✅ 승인 완료 급여</h3>

      {/* 필터 */}
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>회원 선택</Form.Label>
              <Form.Select
                name="memberId"
                value={filters.memberId}
                onChange={handleFilterChange}
              >
                <option value="">전체</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>급여월</Form.Label>
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
            <th>회원명</th>
            <th>유형</th>
            <th>기본급</th>
            <th>시급</th>
            <th>실지급액</th>
            <th>상태</th>
            <th>지급일</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((s) => (
            <tr key={s.salaryId}>
              <td>{s.salaryId}</td>
              <td>{s.memberName}</td>
              <td>{s.salaryType}</td>
              <td>{s.baseSalary}</td>
              <td>{s.hourlyRate}</td>
              <td>{s.netPay}</td>
              <td>{s.status}</td>
              <td>
                {s.salaryMonth
                  ? s.salaryMonth
                  : s.payDate
                  ? s.payDate.slice(0, 7)
                  : "-"}
              </td>
              <td>{s.payDate || "-"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
