import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SalaryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salary, setSalary] = useState(null);

  useEffect(() => {
    axios.get(`/salaries/${id}`)
      .then(res => setSalary(res.data))
      .catch(() => alert('급여 정보를 불러올 수 없습니다.'));
  }, [id]);

  if (!salary) return <p>불러오는 중...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h3>📄 급여 상세 정보</h3>

      <p><strong>직원 ID:</strong> {salary.memberId}</p>
      <p><strong>직원 이름:</strong> {salary.memberName}</p>
      <p><strong>급여월:</strong> {salary.salaryMonth}</p>
      <p><strong>기본급:</strong> {salary.baseSalary.toLocaleString()}원</p>

      {salary.overtimePay > 0 && (
        <p><strong>연장근무 수당:</strong> {salary.overtimePay.toLocaleString()}원</p>
      )}

      <div style={{ marginTop: '10px' }}>
        <strong>공제 내역:</strong>
        {salary.deductions && salary.deductions.length > 0 ? (
          <ul>
            {salary.deductions.map((d, idx) => (
              <li key={idx}>
                {d.name}: {d.amount.toLocaleString()}원
              </li>
            ))}
          </ul>
        ) : (
          <p>공제 없음</p>
        )}
      </div>

      <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
        💰 총 지급액: {salary.realSalary.toLocaleString()}원
      </p>

      <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
        목록으로 돌아가기
      </button>
    </div>
  );
};

export default SalaryDetailPage;
