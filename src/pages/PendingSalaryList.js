import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingSalaryList = () => {
  const [pendingSalaries, setPendingSalaries] = useState([]);

  useEffect(() => {
    axios.get('/salaries/pending', { withCredentials: true })
      .then(res => setPendingSalaries(res.data))
      .catch(err => console.error('승인 대기 급여 조회 실패:', err));
  }, []);

  return (
    <div>
      <h2>승인 대기 급여 목록</h2>
      <table>
        <thead>
          <tr>
            <th>사원 ID</th>
            <th>이름</th>
            <th>기본급</th>
            <th>보너스</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {pendingSalaries.map(salary => (
            <tr key={salary.id}>
              <td>{salary.memberId}</td>
              <td>{salary.memberName}</td>
              <td>{salary.baseSalary.toLocaleString()}원</td>
              <td>{salary.bonus.toLocaleString()}원</td>
              <td>{salary.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingSalaryList;
