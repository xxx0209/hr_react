import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/api';
import { AuthContext } from '../context/AuthContext';
import SalaryDetailCard from './SalaryDetailCard';

const MySalaryHistory = () => {
  const { currentUser } = useContext(AuthContext);
  const memberId = currentUser?.id;

  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSalary, setSelectedSalary] = useState(null);

  const fetchSalaries = async () => {
    if (!memberId) return;
    try {
      const res = await axios.get(`/api/salaries/member/${memberId}/list`, {
        withCredentials: true
      });
      setSalaries(res.data);
    } catch (err) {
      console.error('급여 내역 조회 실패:', err);
      alert('급여 내역을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [memberId]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        <h2 style={styles.title}>나의 급여 내역</h2>
        {loading ? (
          <p>불러오는 중...</p>
        ) : salaries.length === 0 ? (
          <p>급여 내역이 없습니다.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>급여 월</th>
                <th>총지급액</th>
                <th>상태</th>
                <th>상세</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map(salary => (
                <tr key={salary.salaryId}>
                  <td>{salary.salaryMonth}</td>
                  <td>{format(salary.grossPay)} 원</td>
                  <td>{salary.status}</td>
                  <td>
                    <button style={styles.detailButton} onClick={() => setSelectedSalary(salary)}>
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={styles.right}>
        <SalaryDetailCard salary={selectedSalary} />
      </div>
    </div>
  );
};

const format = (value) => {
  if (!value) return '0';
  return Number(value).toLocaleString();
};

const styles = {
  wrapper: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  left: {
    flex: 4,
    backgroundColor: '#f4f6f8',
    padding: '20px',
    borderRadius: '12px'
  },
  right: {
    flex: 8
  },
  title: {
    textAlign: 'center',
    color: '#333'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  detailButton: {
    padding: '6px 12px',
    backgroundColor: '#0078d4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default MySalaryHistory;
