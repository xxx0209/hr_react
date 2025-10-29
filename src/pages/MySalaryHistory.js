import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SalaryDetailCard from './SalaryDetailCard';

const MySalaryHistory = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlySalaries, setMonthlySalaries] = useState([]);
  const [selectedSalaryId, setSelectedSalaryId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const memberId = '로그인된사용자ID'; // 실제 로그인 정보로 대체

  useEffect(() => {
    const fetchAllMonths = async () => {
      const requests = Array.from({ length: 12 }, (_, i) =>
        axios.get(`/salaries/member/${memberId}/monthly`, {
          params: { year, month: i + 1 },
          withCredentials: true
        })
      );

      try {
        const results = await Promise.all(requests);
        const allSalaries = results
          .map((res, i) => ({ month: i + 1, data: res.data }))
          .filter(entry => entry.data.length > 0)
          .sort((a, b) => b.month - a.month); // 내림차순

        setMonthlySalaries(allSalaries);
      } catch (err) {
        console.error('급여 내역 조회 실패:', err);
        alert('급여 내역을 불러오지 못했습니다.');
      }
    };

    fetchAllMonths();
  }, [memberId, year]);

  return (
    <div>
      <h2>나의 급여 내역</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>연도: </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        />
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* 왼쪽 4 */}
        <div style={{ flex: 1 }}>
          {monthlySalaries.length === 0 ? (
            <p>급여 내역이 없습니다.</p>
          ) : (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th>월</th>
                  <th>총 급여</th>
                  <th>상태</th>
                  <th>상세</th>
                </tr>
              </thead>
              <tbody>
                {monthlySalaries.map(entry => {
                  const salary = entry.data[0]; // 월별 첫 번째 급여
                  return (
                    <tr key={salary.id}>
                      <td>{entry.month}월</td>
                      <td>{salary.grossPay.toLocaleString()}원</td>
                      <td>{salary.status}</td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedSalaryId(salary.id);
                            setShowDetail(true);
                          }}
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 오른쪽 8 */}
        <div style={{ flex: 2 }}>
          {showDetail && selectedSalaryId && (
            <SalaryDetailCard salaryId={selectedSalaryId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MySalaryHistory;
