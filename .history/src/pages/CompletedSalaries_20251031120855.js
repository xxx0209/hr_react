import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import SelectCombo from '../sample/SelectCombo';

const SalaryListPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberOptions, setMemberOptions] = useState([]);
  const [filters, setFilters] = useState({
    memberId: '',
    salaryMonth: ''
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get('/member/list');
        const options = res.data.map(m => ({
          value: m.id,
          label: `${m.name} (${m.id})`
        }));
        setMemberOptions(options);
      } catch (err) {
        console.error('회원 목록 불러오기 실패:', err);
      }
    };

    fetchMembers();
    fetchSalaries(); // 초기 전체 조회
  }, []);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const [year, month] = filters.salaryMonth
        ? filters.salaryMonth.split('-')
        : [undefined, undefined];

      const res = await axios.get('/api/salaries/completed/search', {
        params: {
          memberId: filters.memberId || undefined,
          year,
          month
        },
        withCredentials: true
      });

      const sorted = res.data.sort(
        (a, b) => new Date(b.payDate) - new Date(a.payDate)
      );
      setSalaries(sorted);
    } catch (err) {
      console.error('급여 목록 불러오기 실패:', err);
      alert('급여 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchSalaries();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>승인된 급여 목록 (검색 가능)</h2>

      <div style={styles.filterBox}>
        <SelectCombo
          options={memberOptions}
          value={filters.memberId}
          onChange={(id) => setFilters(prev => ({ ...prev, memberId: id }))}
          searchable={true}
          placeholder="회원"
        />
        <input
          type="month"
          value={filters.salaryMonth}
          onChange={(e) =>
            setFilters(prev => ({ ...prev, salaryMonth: e.target.value }))
          }
          style={styles.select}
        />
        <button onClick={handleSearch} style={styles.button}>검색</button>
      </div>

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
                <td>{new Date(s.payDate).toLocaleDateString()}</td>
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
    justifyContent: 'center',
    alignItems: 'center'
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
