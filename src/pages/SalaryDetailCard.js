import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalaryDetailCard = ({ salaryId }) => {
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!salaryId) return;

    setLoading(true);
    axios.get(`/salaries/${salaryId}`, { withCredentials: true })
      .then(res => {
        setSalary(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('급여 상세 조회 실패:', err);
        alert('급여 상세 정보를 불러오지 못했습니다.');
        setLoading(false);
      });
  }, [salaryId]);

  if (loading) return <p>불러오는 중...</p>;
  if (!salary) return <p>급여 정보를 찾을 수 없습니다.</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
      <h3>{salary.payDate} 지급 급여 상세</h3>
      <p><strong>총 급여:</strong> {salary.grossPay.toLocaleString()}원</p>
      <p><strong>실지급액:</strong> {salary.netPay.toLocaleString()}원</p>

      <h4>공제 내역</h4>
      <ul>
        {salary.taxDeductions?.map((deduction, idx) => (
          <li key={idx}>
            {deduction.deductionType.name}: {deduction.amount.toLocaleString()}원
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalaryDetailCard;
