import React, { useEffect, useState } from 'react';
import axios from '../api/api';

const PendingSalaryList = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingSalaries = async () => {
    try {
      const res = await axios.get('/api/salaries/pending', { withCredentials: true });
      setSalaries(res.data);
    } catch (err) {
      console.error('승인 대기 급여 조회 실패:', err);
      alert('급여 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (salaryId) => {
    try {
      await axios.patch(`/api/salaries/${salaryId}/status`, null, {
        params: { status: 'COMPLETED' },
        withCredentials: true
      });
      alert('승인 및 지급 완료되었습니다.');
      fetchPendingSalaries();
    } catch (err) {
      console.error('승인 실패:', err);
      alert(err.response?.data || '급여 승인 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (salaryId) => {
    if (!window.confirm('정말로 이 급여를 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/salaries/${salaryId}`, { withCredentials: true });
      alert('삭제 완료되었습니다.');
      fetchPendingSalaries();
    } catch (err) {
      console.error('삭제 실패:', err);
      alert(err.response?.data || '급여 삭제 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchPendingSalaries();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>승인 대기 급여 목록</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : salaries.length === 0 ? (
        <p>현재 승인 대기 중인 급여가 없습니다.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>사원 ID</th>
              <th>이름</th>
              <th>급여 월</th>
              <th>기본급</th>
              <th>초과근무 수당</th>
              <th>총지급액</th>
              <th>상태</th>
              <th>승인</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map(salary => (
              <tr key={salary.salaryId}>
                <td>{salary.memberId}</td>
                <td>{salary.memberName}</td>
                <td>{salary.salaryMonth}</td>
                <td>{format(salary.customBaseSalary)} 원</td>
                <td>{format(salary.hoursBaseSalary)} 원</td>
                <td>{format(salary.grossPay)} 원</td>
                <td>{salary.status}</td>
                <td>
                  <button style={styles.approveButton} onClick={() => handleApprove(salary.salaryId)}>
                    승인
                  </button>
                </td>
                <td>
                  <button style={styles.deleteButton} onClick={() => handleDelete(salary.salaryId)}>
                    삭제
                  </button>
                </td>
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
    marginTop: '20px'
  },
  approveButton: {
    padding: '6px 12px',
    backgroundColor: '#0078d4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#d83b01',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default PendingSalaryList;
