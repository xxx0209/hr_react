import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import SelectCombo from '../sample/SelectCombo';

const SalaryListPage = () => {
  const [memberOptions, setMemberOptions] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get('/member/list', { withCredentials: true });
        const options = res.data.map(m => ({
          value: m.id,
          label: `${m.name} (${m.id})`
        }));
        setMemberOptions(options);
      } catch (err) {
        console.error('사원 목록 불러오기 실패:', err);
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchSalaries = async () => {
      setLoading(true);
      try {
        const endpoint = selectedMemberId
          ? `/api/salaries/member/${selectedMemberId}/list`
          : `/api/salaries/list`;

        const res = await axios.get(endpoint, { withCredentials: true });
        setSalaries(res.data);
      } catch (err) {
        console.error('급여 조회 실패:', err);
        alert('급여 내역을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchSalaries();
  }, [selectedMemberId]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>급여 목록 조회</h2>

      <div style={styles.filter}>
        <SelectCombo
          label="사원 선택"
          options={memberOptions}
          value={selectedMemberId}
          onChange={setSelectedMemberId}
          searchable
        />
      </div>

      {loading ? (
        <p>불러오는 중...</p>
      ) : salaries.length === 0 ? (
        <p>급여 내역이 없습니다.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>급여 월</th>
              <th>기본급</th>
              <th>초과근무 수당</th>
              <th>총지급액</th>
              <th>공제액</th>
              <th>실지급액</th>
              <th>지급일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map(salary => (
              <tr key={salary.salaryId}>
                <td>{salary.salaryMonth}</td>
                <td>{format(salary.customBaseSalary)} 원</td>
                <td>{format(salary.hoursBaseSalary)} 원</td>
                <td>{format(salary.grossPay)} 원</td>
                <td>{format(salary.totalDeduction)} 원</td>
                <td>{format(salary.netPay)} 원</td>
                <td>{salary.payDate}</td>
                <td>{salary.status}</td>
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
    backgroundColor: '#f4f6f8',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif'
  },
  title: {
    textAlign: 'center',
    color: '#333'
  },
  filter: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  }
};

export default SalaryListPage;
