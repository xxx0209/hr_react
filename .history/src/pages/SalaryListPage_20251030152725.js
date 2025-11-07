import React, { useEffect, useState } from 'react';
import axios from '../api/api';

const SalaryListPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedSalaries = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/salaries/', {
        withCredentials: true
      });
      // 최신순 정렬 (지급일 기준)
      const sorted = res.data.sort((a, b) => new Date(b.payDate) - new Date(a.payDate));
      setSalaries(sorted);
    } catch (err) {
      console.error('급여 내역 조회 실패:', err);
      alert(err.response?.data || '승인된 급여 내역을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedSalaries();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>승인된 급여 내역 (최신순)</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : salaries.length === 0 ? (
        <p>승인된 급여가 없습니다.</p>
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
                <td>{format(s.customBaseSalary)} 원</td>
                <td>{format(s.hoursBaseSalary)} 원</td>
                <td>{format(s.grossPay)} 원</td>
                <td>{format(s.netPay)} 원</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const format = (value) => {
  if (!value) return '0';
  return Number(value).toLocaleString();
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: '#fff'
  }
};

export default SalaryListPage;
