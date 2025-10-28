import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BaseSalaryForm = () => {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  useEffect(() => {
    axios.get('/members')
      .then(res => setMembers(res.data));
  }, []);

  useEffect(() => {
    if (selectedMemberId) {
      axios.get(`/base-salary/${selectedMemberId}`)
        .then(res => {
          setBaseSalary(res.data.baseSalary || '');
          setHourlyRate(res.data.hourlyRate || '');
        });
    }
  }, [selectedMemberId]);

  const handleSave = () => {
    axios.put(`/base-salary/${selectedMemberId}`, {
      baseSalary: Number(baseSalary),
      hourlyRate: Number(hourlyRate)
    })
    .then(() => alert('기본급 설정 완료'))
    .catch(() => alert('실패'));
  };

  return (
    <div>
      <h4>👤 개인 기본급 설정</h4>
      <select value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)}>
        <option value="">-- 직원 선택 --</option>
        {members.map(m => (
          <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
        ))}
      </select>
      <input type="number" placeholder="기본급" value={baseSalary} onChange={e => setBaseSalary(e.target.value)} />
      <input type="number" placeholder="시급" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} />
      <button onClick={handleSave}>저장</button>
    </div>
  );
};

export default BaseSalaryForm;
