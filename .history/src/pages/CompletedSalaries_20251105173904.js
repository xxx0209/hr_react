import React, { useEffect, useState } from "react";
import { Table, Form, Row, Col } from "react-bootstrap";
import axios from "../api/api";

export default function CompletedSalaries() {
  const [list, setList] = useState([]); // 전체 승인 완료 급여
  const [filteredList, setFilteredList] = useState([]); // 필터링된 결과
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({
    memberId: "",
    salaryMonth: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, salariesRes] = await Promise.all([
        axios.get("/member/list"),
        axios.get("/api/salaries/completed"), // 승인 완료 급여
      ]);

      setMembers(membersRes.data);
      setList(salariesRes.data);
      setFilteredList(salariesRes.data); // 초기에는 전체 표시
    } catch (err) {
      console.error("데이터 로딩 실패", err);
    }
  };

  // 필터 변경 시
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
      const matchMonth = newFilters.salaryMonth
        ? s.salaryMonth && s.salaryMonth.startsWith(newFilters.salaryMonth)
        : true;

      return matchMember && matchMonth;
    });

    setFilteredList(filtered);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">✅ 승인 완료 급여</h3>

      {/* 필터 영역 */}
      <Form className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>회원</Form.Label>
              <Form.Select
                name="memberId"
                value={filters.memberId}
                onChange={handleFilterChange}
              >
                <option value="">전체</option>
                {members.map((m) => (
                  <option key={m.id} value={String(m.id)}>
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

      {/* 급여 목록 테이블 */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>회원명</th>
            <th>유형</th>
            <th>기본급</th>
            <th>시급</th>
            <th>순급여</th>
            <th>급여월</th>
            <th>지급일</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length > 0 ? (
            filteredList.map((s) => (
              <tr key={s.salaryId}>
                <td>{s.salaryId}</td>
                <td>{s.memberName}</td>
                <td>{s.salaryType}</td>
                <td>{s.baseSalary}</td>
                <td>{s.hourlyRate}</td>
                <td>{s.netPay}</td>
                <td>{s.salaryMonth}</td>
                <td>{s.payDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
