import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalaryListPage = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [memberFilter, setMemberFilter] = useState('');
  const [salaries, setSalaries] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSalaries = () => {
    setLoading(true);
    axios
      .get('/salaries/all', {
        params: { year, month, page, size },
        withCredentials: true
      })
      .then((res) => {
        const filtered = memberFilter
          ? res.data.content.filter(s => s.memberId.includes(memberFilter))
          : res.data.content;
        setSalaries(filtered);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error('전체 급여 목록 조회 실패:', err);
        alert('급여 목록을 불러오지 못했습니다.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSalaries();
  }, [year, month, page, size]);

  const handlePageChange = (direction) => {
    if (direction === 'prev' && page > 0) setPage(page - 1);
    if (direction === 'next' && page < totalPages - 1) setPage(page + 1);
  };

  return (
    <div>
      <h2>전체 급여 내역 (관리자)</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>연도: </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        />
        <label style={{ marginLeft: '1rem' }}>월: </label>
        <input
          type="number"
          value={month}
          min="1"
          max="12"
          onChange={(e) => setMonth(parseInt(e.target.value))}
        />
        <label style={{ marginLeft: '1rem' }}>사원 검색: </label>
        <input
          type="text"
          value={memberFilter}
          onChange={(e) => setMemberFilter(e.target.value)}
          placeholder="사원 ID 또는 이름"
        />
        <button style={{ marginLeft: '1rem' }} onClick={fetchSalaries}>검색</button>
      </div>

      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>사원 ID</th>
                <th>기본급</th>
                <th>초과수당</th>
                <th>총 급여</th>
                <th>공제합계</th>
                <th>실지급액</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((salary) => (
                <tr key={salary.id}>
                  <td>{salary.memberId}</td>
                  <td>{salary.customBaseSalary.toLocaleString()}원</td>
                  <td>{salary.hoursBaseSalary.toLocaleString()}원</td>
                  <td>{salary.grossPay.toLocaleString()}원</td>
                  <td>{salary.totalDeduction.toLocaleString()}원</td>
                  <td>{salary.netPay.toLocaleString()}원</td>
                  <td>{salary.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => handlePageChange('prev')} disabled={page === 0}>
              이전
            </button>
            <span style={{ margin: '0 10px' }}>
              {page + 1} / {totalPages}
            </span>
            <button onClick={() => handlePageChange('next')} disabled={page >= totalPages - 1}>
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SalaryListPage;
