import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SalaryEditPage = () => {
  const { salaryId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    memberId: '',
    year: '',
    month: '',
    baseSalary: '',
  });

  useEffect(() => {
    axios.get(`/salaries/${salaryId}`, { withCredentials: true })
      .then(res => {
        const data = res.data;
        setForm({
          memberId: data.memberId,
          year: data.year,
          month: data.month,
          baseSalary: data.baseSalary,
        });
      })
      .catch(err => console.error('급여 상세 조회 실패:', err));
  }, [salaryId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`/salaries/${salaryId}`, form, { withCredentials: true })
      .then(() => {
        alert('급여 수정 완료');
        navigate('/salaries');
      })
      .catch(err => console.error('급여 수정 실패:', err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>급여 수정</h3>
      <input name="memberId" value={form.memberId} onChange={handleChange} disabled />
      <input name="year" value={form.year} onChange={handleChange} type="number" />
      <input name="month" value={form.month} onChange={handleChange} type="number" />
      <input name="baseSalary" value={form.baseSalary} onChange={handleChange} type="number" />
      <button type="submit">수정 완료</button>
    </form>
  );
};

export default SalaryEditPage;
