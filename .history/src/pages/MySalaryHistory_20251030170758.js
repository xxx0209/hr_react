import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import SalaryDetailCard from '../components/SalaryDetailCard';


const MySalaryHistory = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [salaryList, setSalaryList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);

  useEffect(() => {
    const fetchMySalaries = async () => {
      try {
        const res = await axios.get(`/api/salaries/member/me/monthly-all?year=${year}`, {
          withCredentials: true
        });
        setSalaryList(res.data); // [{ month: 1, salaryId: 123, ... }]
      } catch (err) {
        console.error('급여 내역 조회 실패:', err);
      }
    };
    fetchMySalaries();
  }, [year]);

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    const matched = salaryList.find(s => s.salaryMonth === `${year}-${String(month).padStart(2, '0')}`);
    setSelectedSalary(matched || null);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '30px' }}>
      {/* 좌측 4 */}
      <div style={{ flex: 4 }}>
        <h3>급여 내역</h3>
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
          {[2023, 2024, 2025].map(y => (
            <option key={y} value={y}>{y}년</option>
          ))}
        </select>
        <ul style={{ marginTop: '20px' }}>
          {[...Array(12)].map((_, i) => {
            const month = 12 - i; // 12월부터 1월까지
            const hasSalary = salaryList.some(s => s.salaryMonth === `${year}-${String(month).padStart(2, '0')}`);
            return (
              <li
                key={month}
                style={{
                  padding: '10px',
                  cursor: hasSalary ? 'pointer' : 'default',
                  color: hasSalary ? '#0078D4' : '#aaa'
                }}
                onClick={() => hasSalary && handleMonthClick(month)}
              >
                {month}월 {hasSalary ? '✔' : ''}
              </li>
            );
          })}
        </ul>
      </div>

      {/* 우측 8 */}
      <div style={{ flex: 8 }}>
        {selectedSalary ? (
          <SalaryDetailCard salary={selectedSalary} />
        ) : (
          <p>월을 선택하면 상세 급여 내역이 표시됩니다.</p>
        )}
      </div>
    </div>
  );
};

export default MySalaryHistory;
