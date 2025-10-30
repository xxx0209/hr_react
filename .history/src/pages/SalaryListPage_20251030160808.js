import React, { useEffect, useState } from 'react';
import axios from '../api/api';

const SalaryListPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const res = await axios.get('/api/salaries/completed/search', {
          withCredentials: true
        });
        const sorted = res.data.sort((a, b) => new Date(b.payDate) - new Date(a.payDate));
        setSalaries(sorted);
      } catch (err) {
        console.error('급여 목록 불러오기 실패:', err);
        alert('급여 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>승인된 급여 목록 (최신순)</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : salaries.length === 0 ? (
        <p>급여 내역이 없습니다.</p>
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff'
  }
};

export default SalaryListPage;
