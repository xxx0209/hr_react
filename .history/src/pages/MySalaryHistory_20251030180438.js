import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import SalaryDetailCard from '../pages/SalaryDetailCard'; // 경로에 맞게 수정하세요

const MySalaryHistory = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [salaryList, setSalaryList] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);

  useEffect(() => {
    const fetchMySalaries = async () => {
      try {
        const res = await axios.get(`/api/salaries/member/me/monthly-all?year=${year}`, {
          withCredentials: true
        });
        const sorted = res.data.sort((a, b) => new Date(b.payDate) - new Date(a.payDate));
        setSalaryList(sorted);
      } catch (err) {
        console.error('급여 내역 조회 실패:', err);
        alert('급여 내역을 불러오지 못했습니다.');
      }
    };
    fetchMySalaries();
  }, [year]);

  return (
    <div style={styles.container}>
      {/* 좌측 4 */}
      <div style={styles.sidebar}>
        <h3 style={styles.title}>내 급여 내역</h3>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          style={styles.select}
        >
          {[2023, 2024, 2025].map(y => (
            <option key={y} value={y}>{y}년</option>
          ))}
        </select>

        <ul style={styles.list}>
          {salaryList.map(s => {
            const month = parseInt(s.salaryMonth.split('-')[1]);
            return (
              <li key={s.salaryId} style={styles.listItem}>
                <span>{month}월</span>
                <button
                  style={styles.detailButton}
                  onClick={() => setSelectedSalary(s)}
                >
                  상세보기
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 우측 8 */}
      <div style={styles.detailArea}>
        {selectedSalary ? (
          <SalaryDetailCard salary={selectedSalary} />
        ) : (
          <p style={{ color: '#666' }}>왼쪽에서 급여 월을 선택하면 상세 내역이 표시됩니다.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '30px',
    padding: '40px',
    fontFamily: 'Segoe UI, sans-serif'
  },
  sidebar: {
    flex: 4,
    backgroundColor: '#f4f6f8',
    padding: '20px',
    borderRadius: '12px'
  },
  title: {
    marginBottom: '10px',
    color: '#333'
  },
  select: {
    width: '100%',
    padding: '8px',
    marginBottom: '20px'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #ddd'
  },
  detailButton: {
    padding: '6px 12px',
    backgroundColor: '#0078D4',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  detailArea: {
    flex: 8,
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  }
};

export default MySalaryHistory;
