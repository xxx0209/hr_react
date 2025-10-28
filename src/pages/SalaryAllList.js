import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SalaryAllList = () => {
  const navigate = useNavigate();

  const [salaryList, setSalaryList] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 검색 필터 상태
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  // 급여 목록 불러오기
  const fetchSalaries = () => {
    axios.get('/salaries/all', {
      params: { year, month, page, size: 10 }
    })
    .then(res => {
      setSalaryList(res.data.content);
      setTotalPages(res.data.totalPages);
    })
    .catch(err => {
      console.error(err);
      alert('급여 목록을 불러오는 데 실패했습니다.');
    });
  };

  useEffect(() => {
    fetchSalaries();
  }, [year, month, page]);

  // 상태 변경 (승인 처리)
  const handleApprove = (id) => {
    axios.patch(`/salaries/${id}/status`, { status: 'COMPLETED' })
      .then(() => {
        alert('급여 승인 완료');
        fetchSalaries(); // 목록 새로고침
      })
      .catch(() => alert('승인 실패'));
  };

  // 필터링된 리스트
  const filteredList = salaryList.filter(s => {
    const matchName = s.memberName?.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = searchStatus ? s.status === searchStatus : true;
    return matchName && matchStatus;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h3>📊 전체 급여 목록</h3>

      {/* 필터 */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          연도:
          <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} />
        </label>
        <label style={{ marginLeft: '20px' }}>
          월:
          <input type="number" value={month} onChange={e => setMonth(Number(e.target.value))} />
        </label>
        <label style={{ marginLeft: '20px' }}>
          직원 이름:
          <input type="text" value={searchName} onChange={e => setSearchName(e.target.value)} />
        </label>
        <label style={{ marginLeft: '20px' }}>
          상태:
          <select value={searchStatus} onChange={e => setSearchStatus(e.target.value)}>
            <option value="">전체</option>
            <option value="DRAFT">DRAFT</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </label>
      </div>

      {/* 테이블 */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>직원 ID</th>
            <th style={thStyle}>직원 이름</th>
            <th style={thStyle}>급여월</th>
            <th style={thStyle}>총급여</th>
            <th style={thStyle}>상태</th>
            <th style={thStyle}>지급일</th>
            <th style={thStyle}>관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map(s => (
            <tr key={s.id}>
              <td style={tdStyle}>{s.memberId}</td>
              <td style={tdStyle}>{s.memberName}</td>
              <td style={tdStyle}>{s.salaryMonth}</td>
              <td style={tdStyle}>{s.grossPay.toLocaleString()}원</td>
              <td style={tdStyle}>{s.status}</td>
              <td style={tdStyle}>{s.payDate}</td>
              <td style={tdStyle}>
                <button onClick={() => navigate(`/salary/detail/${s.id}`)}>상세보기</button>
                {s.status === 'DRAFT' && (
                  <button
                    style={{ marginLeft: '8px' }}
                    onClick={() => handleApprove(s.id)}
                  >
                    승인
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이징 */}
      <div style={{ marginTop: '20px' }}>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>이전</button>
        <span style={{ margin: '0 10px' }}>{page + 1} / {totalPages}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>다음</button>
      </div>
    </div>
  );
};

const thStyle = { border: '1px solid #ccc', padding: '8px', backgroundColor: '#f0f0f0' };
const tdStyle = { border: '1px solid #ccc', padding: '8px', textAlign: 'center' };

export default SalaryAllList;
