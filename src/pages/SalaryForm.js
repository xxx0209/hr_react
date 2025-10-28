import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalaryForm = () => {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [baseSalary, setBaseSalary] = useState(null);
  const [hourlyRate, setHourlyRate] = useState(null);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [loading, setLoading] = useState(false);

  // 직원 목록 불러오기
  useEffect(() => {
    axios.get('/members')
      .then(res => setMembers(res.data))
      .catch(() => alert('직원 목록을 불러올 수 없습니다.'));
  }, []);

  // 직원 선택 시 개인 기본급 조회
  useEffect(() => {
    if (selectedMemberId) {
      axios.get(`/base-salary/${selectedMemberId}`)
        .then(res => {
          setBaseSalary(res.data.baseSalary || null);
          setHourlyRate(res.data.hourlyRate || null);
        })
        .catch(() => {
          setBaseSalary(null);
          setHourlyRate(null);
        });
    }
  }, [selectedMemberId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMemberId) {
      alert('직원을 선택해주세요.');
      return;
    }

    setLoading(true);
    axios.post('/salaries', {
      memberId: selectedMemberId,
      overtimeHours: Number(overtimeHours)
      // payDate는 생략 → 백엔드에서 20일로 자동 설정
    })
    .then(() => {
      alert('급여 생성 완료!');
      setSelectedMemberId('');
      setBaseSalary(null);
      setHourlyRate(null);
      setOvertimeHours(0);
    })
    .catch(() => alert('급여 생성 실패'))
    .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h3>➕ 급여 생성 (관리자)</h3>
      <form onSubmit={handleSubmit}>
        <label>직원 선택</label>
        <select
          value={selectedMemberId}
          onChange={e => setSelectedMemberId(e.target.value)}
          required
        >
          <option value="">-- 직원 선택 --</option>
          {members.map(m => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.id})
            </option>
          ))}
        </select>

        {baseSalary !== null && (
          <div style={{ marginTop: '10px' }}>
            <p>📌 기본급: {Number(baseSalary).toLocaleString()}원</p>
            <p>⏱️ 시급: {Number(hourlyRate).toLocaleString()}원</p>
          </div>
        )}

        <label style={{ marginTop: '10px' }}>초과근무 시간</label>
        <input
          type="number"
          value={overtimeHours}
          onChange={e => setOvertimeHours(e.target.value)}
          placeholder="예: 5"
          min="0"
        />

        <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? '처리 중...' : '급여 생성'}
        </button>
      </form>
    </div>
  );
};

export default SalaryForm;
