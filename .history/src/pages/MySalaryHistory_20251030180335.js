import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import SalaryDetailCard from '../components/SalaryDetailCard';

const MySalaryHistory = () => {
  const [salaryMonth, setSalaryMonth] = useState('');
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMonthChange = async (e) => {
    const selectedMonth = e.target.value;
    setSalaryMonth(selectedMonth);
    setLoading(true);

    try {
      const [year, month] = selectedMonth.split('-');
      const res = await axios.get(`/api/salaries/member/me/monthly?year=${year}&month=${month}`, {
        withCredentials: true
      });
      setSalary(res.data.length > 0 ? res.data[0] : null); // 단건 또는 리스트 처리
    } catch (err) {
      console.error('급여 조회 실패:', err);
      alert('급여 내역을 불러오지 못했습니다.');
      setSalary(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px' }}>
      <h2 style={{ marginBottom: '20px' }}>내 급여 내역 조회</h2>

      <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>급여 대상 월</label>
      <input
        type="month"
        value={salaryMonth}
        onChange={handleMonthChange}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          fontSize: '14px'
        }}
      />

      {loading ? (
        <p>급여 내역을 불러오는 중입니다...</p>
      ) : salary ? (
        <SalaryDetailCard salary={salary} />
      ) : salaryMonth ? (
        <p style={{ color: '#666' }}>해당 월의 급여 내역이 없습니다.</p>
      ) : (
        <p style={{ color: '#666' }}>급여 대상 월을 선택해주세요.</p>
      )}
    </div>
  );
};

export default MySalaryHistory;
