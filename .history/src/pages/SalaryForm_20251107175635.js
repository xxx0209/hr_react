import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col, Pagination } from "react-bootstrap";
import axios from "../api/api";
import SelectCombo from "../sample/SelectCombo";

export default function SalaryManager() {
const [show, setShow] = useState(false);
const [list, setList] = useState([]);
const [totalPages, setTotalPages] = useState(1);
const [currentPage, setCurrentPage] = useState(0); // 0-based page
const [pageSize] = useState(10);

const [members, setMembers] = useState([]);
const [memberSalaries, setMemberSalaries] = useState([]);
const [positionSalaries, setPositionSalaries] = useState([]);
const [form, setForm] = useState({
salaryId: "",
memberId: "",
salaryType: "",
positionSalaryId: "",
baseSalary: "",
hourlyRate: "",
salaryMonth: "",
payDate: "",
status: "DRAFT",
availablePositionSalaries: [],
});

const formatNumber = (num) => {
if (!num) return "";
return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

useEffect(() => {
fetchData();
}, [currentPage]);

const fetchData = async () => {
try {
const [membersRes, memberSalaryRes, positionsRes, salariesRes] =
await Promise.all([
axios.get("/member/list"),
axios.get("/api/member-salaries"),
axios.get("/api/position-salaries"),
axios.get(`/api/salaries/drafts?page=${currentPage}&size=${pageSize}`),
]);
setMembers(membersRes.data);
setMemberSalaries(memberSalaryRes.data);
setPositionSalaries(positionsRes.data);
setList(salariesRes.data.content); // Page<SalaryResponseDto> content
setTotalPages(salariesRes.data.totalPages);
} catch (err) {
console.error("데이터 로딩 실패", err);
}
};

const handlePageChange = (page) => {
if (page >= 0 && page < totalPages) setCurrentPage(page);
};

const renderPagination = () => {
let items = [];
for (let i = 0; i < totalPages; i++) {
items.push(
<Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
{i + 1}
</Pagination.Item>
);
}
return <Pagination>{items}</Pagination>;
};

// ... handleShow, handleClose, handleMemberChange, handlePositionSalaryChange, handleSalaryMonthChange, handleChange, handleSubmit, handleEdit, handleDelete, handleApprove
// 기존 코드 그대로 사용

return ( <div className="container mt-4"> <h3 className="mb-3">💰 급여 관리</h3>
<Button variant="primary" onClick={() => setShow(true)}>+ 급여 등록</Button>

```
  <Table striped bordered hover className="mt-3">
    <thead>
      <tr>
        <th>ID</th>
        <th>회원명</th>
        <th>유형</th>
        <th>기본급</th>
        <th>시급</th>
        <th>급여월</th>
        <th>상태</th>
        <th>액션</th>
      </tr>
    </thead>
    <tbody>
      {list.map((s) => (
        <tr key={s.salaryId}>
          <td>{s.salaryId}</td>
          <td>{s.memberName}</td>
          <td>{s.salaryType}</td>
          <td>{formatNumber(s.baseSalary)}원</td>
          <td>{formatNumber(s.hourlyRate)}원</td>
          <td>{s.salaryMonth}</td>
          <td>{s.status}</td>
          <td>
            {s.salaryType !== "MEMBER" && (
              <Button size="sm" variant="warning" onClick={() => handleEdit(s)} className="me-1">수정</Button>
            )}
            <Button size="sm" variant="danger" onClick={() => handleDelete(s.salaryId)} className="me-1">삭제</Button>
            <Button size="sm" variant="success" onClick={() => handleApprove(s.salaryId)} disabled={s.status === "COMPLETED"}>승인</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>

  {renderPagination()}

  {/* Modal Form 부분은 기존 코드 그대로 사용 */}
</div>
```

);
}
