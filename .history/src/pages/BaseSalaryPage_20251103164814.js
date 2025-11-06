import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import SelectCombo from '../sample/SelectCombo';

const EmployeeSalaryPage = () => {
  const [positions, setPositions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [form, setForm] = useState({ positionId: '', employeeId: '', baseSalary: '', hourlyRate: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [posRes, empRes, salRes] = await Promise.all([
          axios.get('/position/all'),
          axios.get('/employee/all'),
          axios.get('/api/employee-salaries'),
        ]);
        setPositions(posRes.data);
        setEmployees(empRes.data);
        setSalaries(salRes.data);
      } catch (err) {
        alert('데이터 불러오기 실패');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (isUpdate = false) => {
    const { positionId, employeeId, baseSalary, hourlyRate } = form;
    if (!positionId || !employeeId || !baseSalary || !hourlyRate) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const payload = {
      positionId,
      employeeId,
      baseSalary: parseFloat(baseSalary),
      hourlyRate: parseFloat(hourlyRate),
    };

    try {
      if (isUpdate) {
        const existing = salaries.find(s => s.positionId === positionId && s.employeeId === employeeId);
        if (!existing) return alert('수정할 기준급이 없습니다.');
        await axios.put(`/api/employee-salaries/${existing.id}`, payload);
        alert('수정 완료');
        setSalaries(salaries.map(s => s.id === existing.id ? { ...s, ...payload } : s));
      } else {
        const res = await axios.post('/api/employee-salaries', payload);
        alert('등록 완료');
        setSalaries([...salaries, res.data]);
      }
      setForm({ positionId: '', employeeId: '', baseSalary: '', hourlyRate: '' });
    } catch (err) {
      alert('처리 실패');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/employee-salaries/${id}`);
      alert('삭제 완료');
      setSalaries(salaries.filter(s => s.id !== id));
    } catch (err) {
      alert('삭제 실패');
      console.error(err);
    }
  };

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto' }}>
      <h2>직급별 직원 기준급 관리</h2>

      <div style={{ marginBottom: '30px', padding: '20px', background: '#f1f1f1', borderRadius: '8px' }}>
        <h3>기준급 등록/수정</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <SelectCombo
            options={positions}
            value={form.positionId}
            onChange={(v) => handleChange('positionId', v)}
            placeholder="직급 선택"
          />
          <SelectCombo
            options={employees}
            value={form.employeeId}
            onChange={(v) => handleChange('employeeId', v)}
            placeholder="직원 선택"
          />
          <input
            type="number"
            placeholder="기본급"
            value={form.baseSalary}
            onChange={(e) => handleChange('baseSalary', e.target.value)}
          />
          <input
            type="number"
            placeholder="시급"
            value={form.hourlyRate}
            onChange={(e) => handleChange('hourlyRate', e.target.value)}
          />
          <button onClick={() => handleSubmit(false)}>등록</button>
          <button onClick={() => handleSubmit(true)}>수정</button>
        </div>
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', backgroundColor: '#fff' }}>
        <thead>
          <tr>
            <th>직급</th>
            <th>직원</th>
            <th>기본급</th>
            <th>시급</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map(s => {
            const pos = positions.find(p => p.positionId === s.positionId);
            const emp = employees.find(e => e.employeeId === s.employeeId);
            return (
              <tr key={s.id}>
                <td>{pos?.positionName || s.positionId}</td>
                <td>{emp?.employeeName || s.employeeId}</td>
                <td>{s.baseSalary.toLocaleString()}</td>
                <td>{s.hourlyRate.toLocaleString()}</td>
                <td><button onClick={() => handleDelete(s.id)}>삭제</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeSalaryPage;
