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

// ✅ 데이터 불러오기 (자동 실행 포함)
const fetchData = async () => {
try {
const [salaryRes, memberRes] = await Promise.all([
axios.get("/api/completed-salaries", {
params: {
memberId: filters.memberId || undefined,
month: filters.month || undefined,
},
}),
axios.get("/member/list"),
]);

```
  // ✅ 응답 구조가 배열/객체 모두 대응
  const salaryData = Array.isArray(salaryRes.data)
    ? salaryRes.data
    : salaryRes.data.content || [];

  setSalaries(salaryData);
  setMembers(memberRes.data);
} catch (error) {
  console.error("데이터 로드 오류:", error);
  alert("데이터를 불러오는 중 오류가 발생했습니다.");
}
```

};

// ✅ 검색버튼 누르지 않아도 자동 필터 반영
useEffect(() => {
fetchData();
}, [filters.memberId, filters.month]);

// 숫자 포맷
const formatNumber = (num) => {
if (!num && num !== 0) return "";
return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

return ( <div className="container mt-4"> <h3>승인 완료 급여 내역</h3>

```
  <div className="d-flex gap-3 mb-3 align-items-center">
    <SelectCombo
      options={members.map((m) => ({
        value: m.memberId,
        label: m.memberName,
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

    <Button variant="secondary" onClick={() => setFilters({ memberId: "", month: "" })}>
      초기화
    </Button>
  </div>

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
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.memberName || "-"}</td>
            <td>{s.positionTitle || s.positionName || "-"}</td>
            <td>
              {s.salaryType === "POSITION"
                ? "직급 기준급"
                : s.salaryType === "MEMBER"
                ? "개인직급"
                : "-"}
            </td>
            <td>{formatNumber(s.baseSalary)}원</td>
            <td>{formatNumber(s.hourlyRate)}원</td>
            <td>{formatNumber(s.totalPay)}원</td>
            <td>{s.payDate || "-"}</td>
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
