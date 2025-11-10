import React, { useEffect, useState } from "react";
import { Table, Form, Button } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";

function CompletedSalaries() {
  const [salaries, setSalaries] = useState([]);
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({
    memberId: "",
    salaryMonth: "",
  });

  // ✅ 승인된 급여 조회 API 호출
  const fetchData = async () => {
    try {
      const params = {};
      if (filters.memberId) params.memberId = filters.memberId;
      if (filters.salaryMonth) params.salaryMonth = filters.salaryMonth;


      const [salaryRes, memberRes] = await Promise.all([
        axios.get("/api/salaries/completed", { params }),
        axios.get("/member/list"),
      ]);

      // 백엔드 응답이 배열 또는 페이지 객체일 수 있음 → 안전 처리
      const data = Array.isArray(salaryRes.data)
        ? salaryRes.data
        : salaryRes.data.content || [];

      setSalaries(data);
      setMembers(memberRes.data);
    } catch (error) {
      console.error("데이터 로드 오류:", error);
      alert("승인된 급여 데이터를 불러오는 중 오류가 발생했습니다.");
    }


  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ 검색 버튼 클릭
  const handleSearch = () => {
    fetchData();
  };

  // ✅ 숫자 포맷 함수
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (<div className="container mt-4"> <h3>승인 완료 급여 내역</h3>


    <div className="d-flex gap-3 mb-3">
      <SelectCombo
        options={members.map((m) => ({
          label: m.name,
          value: m.id,
        }))}
        value={filters.memberId}
        onChange={(v) => setFilters({ ...filters, memberId: v })}
        placeholder="회원 선택"
      />

      <Form.Control
        type="month"
        value={filters.salaryMonth}
        onChange={(e) =>
          setFilters({ ...filters, salaryMonth: e.target.value })
        }
        style={{ width: "200px" }}
      />

      <Button variant="primary" onClick={handleSearch}>
        검색
      </Button>
    </div>

    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>회원명</th>
          <th>직급</th>
          <th>기본급</th>
          <th>시급</th>
          <th>총 근무시간</th>
          <th>총 급여</th>
          <th>급여월</th>
          <th>지급일</th>
        </tr>
      </thead>
      <tbody>
        {salaries.length > 0 ? (
          salaries.map((s) => (
            <tr key={s.salaryId}>
              <td>{s.salaryId}</td>
              <td>{s.memberName}</td>
              <td>{s.positionName || "-"}</td>
              <td>{formatNumber(s.baseSalary)}원</td>
              <td>{formatNumber(s.hourlyRate)}원</td>
              <td>{s.totalHours ?? 0}</td>
              <td>{formatNumber(s.totalPay)}원</td>
              <td>{s.salaryMonth}</td>
              <td>{s.payDate}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="9" className="text-center">
              승인된 급여 데이터가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>


  );
}

export default CompletedSalaries;
