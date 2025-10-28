import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {} from "react-bootstrap";

const SalaryPage = () => {
  const [salaryList, setSalaryList] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);

  useEffect(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    axios.get('/salaries/member/me/monthly', {
      params: { year, month, page: 0, size: 12 }
    })
    .then(res => {
      const sorted = res.data.content.sort((a, b) => new Date(b.payDate) - new Date(a.payDate));
      setSalaryList(sorted);
    })
    .catch(err => {
      console.error(err);
      alert('급여 데이터를 불러오는 데 실패했습니다.');
    });
  }, []);

  const handleDetail = (salaryId) => {
    axios.get(`/salaries/${salaryId}`)
      .then(res => setSelectedSalary(res.data))
      .catch(err => {
        console.error(err);
        alert('상세 급여 정보를 불러오는 데 실패했습니다.');
      });
  };

  return (
    <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
      {/* 좌측 4: 급여 리스트 */}
      <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: '20px' }}>
        <h4>📋 월별 급여 내역</h4>
        {salaryList.map(s => (
          <div key={s.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
            <div><strong>{s.salaryMonth}월</strong></div>
            <div>지급일: {s.payDate}</div>
            <div>총급여: {s.grossPay.toLocaleString()}원</div>
            <button onClick={() => handleDetail(s.id)} style={{ marginTop: '5px', padding: '5px 10px', cursor: 'pointer' }}>
              상세보기
            </button>
          </div>
        ))}
      </div>

      {/* 우측 8: 급여 상세 */}
      <div style={{ flex: 2, paddingLeft: '20px' }}>
        {selectedSalary ? (
          <>
            <h4>🧾 {selectedSalary.salaryMonth}월 급여 상세</h4>
            <p>기본급: {selectedSalary.basePay.toLocaleString()}원</p>
            <p>공제내역: {selectedSalary.deductionItems}</p>
            <p>공제금액: {selectedSalary.totalDeduction.toLocaleString()}원</p>
            <p>총급여: {selectedSalary.grossPay.toLocaleString()}원</p>
            <p>실수령액: {selectedSalary.netPay.toLocaleString()}원</p>
            <p>상태: {selectedSalary.status}</p>
          </>
        ) : (
          <p>급여 항목을 선택하면 상세 내역이 표시됩니다.</p>
        )}
      </div>
    </div>
  );
};

export default SalaryPage;
