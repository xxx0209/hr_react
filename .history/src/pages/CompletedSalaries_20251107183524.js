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
axios.get("/api/completed-salaries", { params: filters }),
axios.get("/member/all"),
]);

```
  // 혹시 서버 응답이 배열이 아닐 경우 대비
  const data = Array.isArray(salaryRes.data) ? salaryRes.data : salaryRes.data.content || [];
  setSalaries(data);
  setMembers(memberRes.data);
} catch (error) {
  console.error("데이터 로드 오류:", error);
  alert("데이터를 불러오는 중 오류가 발생했습니다.");
}
```

};

useEffect(() => {
fetchData();
}, []);

// 검색 버튼 클릭 시
const handleSearch = () => {
fetchData();
};

// 숫자 포맷 함수
const formatNumber = (num) => {
if (!num && num !== 0) return "";
return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

return ( <div className="container mt-4"> <h3>승인 완료 급여 내역</h3>

```
  <div className="d-flex gap-3 mb-3">
    <SelectCombo
      options={members}
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
        <th>직급</th>
        <th>기본급</th>
        <th>시급</th>
        <th>총 근무시간</th>
        <th>총 급여</th>
        <th>월</th>
        <th>지급일</th>
      </tr>
    </thead>
    <tbody>
      {salaries.length > 0 ? (
        salaries.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.memberName}</td>
            <td>{s.positionName}</td>
            <td>{formatNumber(s.baseSalary)}원</td>
            <td>{formatNumber(s.hourlyRate)}원</td>
            <td>{s.totalHours}</td>
            <td>{formatNumber(s.totalPay)}원</td>
            <td>{s.month}</td>
            <td>{s.payDate}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="9" className="text-center">
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
