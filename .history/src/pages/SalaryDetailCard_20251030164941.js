// SalaryDetailCard.jsx
import React from 'react';

const SalaryDetailCard = ({ salary }) => {
  if (!salary) return <p>상세 정보를 보려면 항목을 선택하세요.</p>;

  return (
    <div style={cardStyle}>
      <h3>급여 상세 정보</h3>
      <p><strong>급여 월:</strong> {salary.salaryMonth}</p>
      <p><strong>기본급:</strong> {salary.customBaseSalary.toLocaleString()} 원</p>
      <p><strong>초과근무 수당:</strong> {salary.hoursBaseSalary.toLocaleString()} 원</p>
      <p><strong>총지급액:</strong> {salary.grossPay.toLocaleString()} 원</p>
      <p><strong>공제액:</strong> {salary.totalDeduction.toLocaleString()} 원</p>
      <p><strong>실지급액:</strong> {salary.netPay.toLocaleString()} 원</p>
      <p><strong>지급일:</strong> {salary.payDate}</p>
      <p><strong>상태:</strong> {salary.status}</p>
    </div>
  );
};

const cardStyle = {
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontFamily: 'Segoe UI, sans-serif'
};

export default SalaryDetailCard;
