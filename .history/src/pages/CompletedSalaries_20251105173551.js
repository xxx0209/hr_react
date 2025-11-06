import React, { useEffect, useState } from "react";
import { Table, Form, Row, Col } from "react-bootstrap";
import axios from "../api/api";

export default function CompletedSalaries() {
  const [list, setList] = useState([]); // 전체 승인 완료 급여
  const [filteredList, setFilteredList] = useState([]); // 필터 적용된 리스트
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({
    memberId: "",
    salaryMonth: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ 데이터 불러오기
  const fetchData = async () => {
    try {
      const [salariesRes, membersRes] = await Promise.all([
        axios.get("/api/salaries/completed"),
        axios.get("/member/list"),
      ]);

      setList(salariesRes.data);
      setFilteredList(salariesRes.data); // 초기 전체 표시
      setMembers(membersRes.data);
    } catch (err) {
      console.error("데이터 로딩 실패", err);
    }
  };

  // ✅ 필터 변경 시 적용
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const filtered = list.filter((s) => {
      const matchMember = newFilters.memberId ? s.memberId === Number(newFilters.memberId) : true;
      const matchMonth = newFilters.salaryMonth
        ? s.salaryMonth.startsWith(newFilters.salaryMonth)
        : true;
      return matchMember && matchMonth;
    });

    setFilteredList(filtered);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">✅ 승인 완료 급여</h3>

      {/* 필터 */}
      <Row className="mb-3 g-3">
        <Col md={4}>
          <Form.Select
            name="memberId"
            value={filters.memberId}
            onChange={handleFilterChange}
          >
            <option value="">전체 회원</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Control
            type="month"
            name="salaryMonth"
            value={filters.salaryMonth}
            onChange={handleFilterChange}
          />
        </Col>
      </Row>

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
            <th>상태</th>
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
                <td>{s.status}</td>
                <td>{s.salaryMonth}</td>
                <td>{s.payDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
