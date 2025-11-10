import React, { useEffect, useState } from "react";
import { Table, Form, Button } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";

function CompletedSalaries() {
  const [salaries, setSalaries] = useState([]);
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({
    memberId: "",
    month: "",
  });

  // 데이터 가져오기
  const fetchData = async () => {
    try {
      const [salaryRes, memberRes] = await Promise.all([
        axios.get("/api/salaries/completed", {
          params: {
            memberId: filters.memberId || undefined,
            month: filters.month || undefined,
          },
        }),
        axios.get("/member/list"),
      ]);

      const salaryData = Array.isArray(salaryRes.data)
        ? salaryRes.data
        : salaryRes.data?.content || [];

      setSalaries(salaryData || []);
      setMembers(memberRes.data || []);
    } catch (error) {
      console.error("데이터 로드 오류:", error);
      alert("데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 필터 변경 시 자동 검색
  useEffect(() => {
    fetchData();
  }, [filters.memberId, filters.month]);

  // 숫자 포맷
  const formatNumber = (num) => {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="container mt-4">
      <h3>승인 완료 급여 내역</h3>

      {/* 필터 */}
      <div className="d-flex gap-3 mb-3 align-items-center">
        <SelectCombo
          options={members.map((m) => ({
            value: m.id || m.memberId,
            label: m.name || m.memberName,
          }))}
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

        <Button
          variant="secondary"
          onClick={() => setFilters({ memberId: "", month: "" })}
        >
          초기화
        </Button>
      </div>

      {/* 테이블 */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>회원명</th>
            <th>직급</th>
            <th>급여 타입</th>
            <th>기본급</th>
            <th>시급</th>
            <th>총 급여</th>
            <th>지급일</th>
          </tr>
        </thead>
        <tbody>
          {salaries.length > 0 ? (
            salaries.map((s) => (
              <tr key={s.salaryId || s.id}>
                <td>{s.salaryId || s.id}</td>
                <td>{s.memberName || s.member?.name || "-"}</td>
                <td>
                  {s.salaryType === "POSITION"
                    ? s.positionTitle || s.positionName || "-"
                    : "-"}
                </td>
                <td>
                  {s.salaryType === "POSITION"
                    ? "직급 기준급"
                    : s.salaryType === "MEMBER"
                    ? "개인 급여"
                    : "-"}
                </td>
                <td>{formatNumber(s.baseSalary)}원</td>
                <td>{formatNumber(s.hourlyRate)}원</td>
                <td>{formatNumber(s.totalPay || s.netPay || 0)}원</td>
                <td>{s.payDate || "20일"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default CompletedSalaries;
