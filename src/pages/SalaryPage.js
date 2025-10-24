import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SalaryPage = () => {
  const { id } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/salaries/member/${id}/monthly`, {
      params: { year: 2025, month: 10, page: 0, size: 10 }
    }).then(res => {
      setSalaries(res.data.content);
    });
  }, [id]);

  return (
    <div>
      <h2>나의 월별 급여</h2>
      {salaries.map(s => (
        <div key={s.id} onClick={() => navigate(`/salary/${s.id}`)}>
          {s.salaryMonth}월 총급여: {s.grossPay.toLocaleString()}원
        </div>
      ))}
    </div>
  );
};
