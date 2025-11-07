import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "../api/api";

export default function CompletedSalaries() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/salaries/completed");
      setList(res.data);
    } catch (err) {
      console.error("데이터 로딩 실패", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">✅ 승인 완료 급여</h3>
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
            <th>지급일</th>
          </tr>
        </thead>
        <tbody>
          {list.map((s) => (
            <tr key={s.salaryId}>
              <td>{s.salaryId}</td>
              <td>{s.memberName}</td>
              <td>{s.salaryType}</td>
              <td>{s.baseSalary}</td>
              <td>{s.hourlyRate}</td>
              <td>{s.netPay}</td>
              <td>{s.status}</td>
              <td>{s.payDate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
