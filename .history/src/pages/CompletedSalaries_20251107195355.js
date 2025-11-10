import React, { useEffect, useState } from "react";
import { Table, Form, Button } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";

function CompletedSalaries() {
  const [salaries, setSalaries] = useState([]);
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({
    memberId: "",
    month: "", // YYYY-MM 형식
  });

  // 숫자 포맷 함수
  const formatNumber = (num) => {
    if (num === null || num === undefined || num === "") return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 승인된 급여 조회 API 호출 (필터를 params로 전달)
  const fetchData = async () => {
    try {
      const params = {};
      if (filters.memberId) params.memberId = filters.memberId;
      if (filters.month) params.salaryMonth = filters.month; // 백엔드가 받는 파라미터명

      const [salaryRes, memberRes] = await Promise.all([
        axios.get("/api/salaries/completed", { params }),
        axios.get("/member/list"),
      ]);

      // 응답이 배열 또는 페이지 객체일 수 있으니 안전 처리
      const data = Array.isArray(salaryRes.data)
        ? salaryRes.data
        : salaryRes.data?.content || [];

      setSalaries(data);
      setMembers(Array.isArray(memberRes.data) ? memberRes.data : memberRes.data?.content || []);
    } catch (error) {
      console.error("데이터 로드 오류:", error);
      alert("승인된 급여 데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    // 초기 로드
    fetchData();
  }, []);

  const handleSearch = () => {
    fetchData();
  };

  return (
    <div className="container mt-4">
      <h3>승인 완료 급여 내역</h3>

      <div className="d-flex gap-3 mb-3">
        <SelectCombo
          options={members.map((m) => ({ label: m.name, value: m.id }))}
          value={filters.memberId}
          onChange={(v) => setFilters({ ...filters, memberId: v })}
          placeholder="회원 선택"
        />

        <Form.Control
          type="month"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
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
            <th>급여유형</th>
            <th>직급 제목</th> {/* 직급 기준이면 title 표시 */}
            <th>기본급</th>
            <th>시급</th>
            <th>총 급여</th>
            <th>급여월</th>
            <th>지급일</th>
          </tr>
        </thead>
        <tbody>
          {salaries.length > 0 ? (
            salaries.map((s) => {
              // 방어적으로 필드명 매핑 (백엔드 DTO가 달라도 동작하도록)
              const salaryId = s.salaryId ?? s.id;
              const memberName = s.memberName ?? s.member?.name ?? s.memberName;
              const salaryType = s.salaryType ?? s.type;
              const title = s.title ?? s.positionTitle ?? s.position?.title ?? s.positionName;
              const baseSalary = s.baseSalary ?? s.base_salary ?? 0;
              const hourlyRate = s.hourlyRate ?? s.hourly_rate ?? 0;
              const totalPay = s.netPay ?? s.totalPay ?? s.total_pay ?? s.grossPay ?? 0;
              const salaryMonth = s.salaryMonth ?? s.month ?? s.salary_month;
              const payDate = s.payDate ?? s.pay_date ?? s.payDate;

              return (
                <tr key={salaryId}>
                  <td>{salaryId}</td>
                  <td>{memberName}</td>

                  <td>
                    {salaryType === "MEMBER"
                      ? "개인"
                      : salaryType === "POSITION"
                      ? "직급"
                      : salaryType ?? "-"}
                  </td>

                  <td>{salaryType === "POSITION" ? title ?? "-" : "-"}</td>

                  <td>{formatNumber(baseSalary)}원</td>
                  <td>{formatNumber(hourlyRate)}원</td>
                  <td>{formatNumber(totalPay)}원</td>
                  <td>{salaryMonth}</td>
                  <td>{payDate}</td>
                </tr>
              );
            })
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
