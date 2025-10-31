import React, { useEffect, useState } from 'react';
import axios from '../api/api';

const SalaryListPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [memberId, setMemberId] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/salaries/completed/search', {
        params: {
          memberId: memberId || undefined,
          year: year || undefined,
          month: month || undefined
        },
        withCredentials: true
      });
      const sorted = res.data.sort((a, b) => new Date(b.payDate) - new Date(a.payDate));
      setSalaries(sorted);
    } catch (err) {
      alert('검색 실패');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(); // 초기 로딩 시 전체 승인된 급여 조회
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>전체 급여 목록 (승인된 급여)</h2>

      <div style={styles.filterBox}>
        <input
          type="text"
          placeholder="회원 ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          style={styles.input}
        />
        <select value={year} onChange={(e) => setYear(e.target.value)} style={styles.select}>
          <option value="">년도 선택</option>
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={month} onChange={(e) => setMonth(e.target.value)} style={styles.select}>
          <option value="">월 선택</option>
          {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}월</option>)}
        </select>
        <button onClick={handleSearch} style={styles.button}>검색</button>
      </div>

      {loading ? (
        <p>불러오는 중...</p>
      ) : salaries.length === 0 ? (
        <p>조회된 급여가 없습니다.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>사원 ID</th>
              <th>이름</th>
              <th>급여 월</th>
              <th>지급일</th>
              <th>기본급</th>
              <th>초과근무 수당</th>
              <th>총지급액</th>
              <th>실지급액</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map(s => (
              <tr key={s.salaryId}>
                <td>{s.memberId}</td>
                <td>{s.memberName}</td>
                <td>{s.salaryMonth}</td>
                <td>{s.payDate}</td>
                <td>{Number(s.customBaseSalary).toLocaleString()} 원</td>
                <td>{Number(s.hoursBaseSalary).toLocaleString()} 원</td>
                <td>{Number(s.grossPay).toLocaleString()} 원</td>
                <td>{Number(s.netPay).toLocaleString()} 원</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif'
  },
  title: {
    textAlign: 'center',
    color: '#333'
  },
  filterBox: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center'
  },
  input: {
    padding: '8px',
    width: '150px'
  },
  select: {
    padding: '8px'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#0078D4',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff'
  }
};

export default SalaryListPage;
