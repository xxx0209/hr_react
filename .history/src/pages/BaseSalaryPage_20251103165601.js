import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import SelectCombo from '../sample/SelectCombo';

const BaseSalaryPage = () => {
  const [positions, setPositions] = useState([]);
  const [baseSalaries, setBaseSalaries] = useState([]);
  const [form, setForm] = useState({ referenceId: '', baseSalary: '', hourlyRate: '' });
  const [loading, setLoading] = useState(true);

  const BASE_SALARY_TYPE = 'POSITION';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posRes, salRes] = await Promise.all([
          axios.get('/position/all'),
          axios.get(`/api/base-salaries?type=${BASE_SALARY_TYPE}`)
        ]);
        setPositions(posRes.data);
        setBaseSalaries(salRes.data);
      } catch (err) {
        alert('데이터 불러오기 실패');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (isUpdate = false) => {
    const { referenceId, baseSalary, hourlyRate } = form;
    if (!referenceId || !baseSalary || !hourlyRate) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const payload = {
      type: BASE_SALARY_TYPE,
      referenceId,
      baseSalary: parseFloat(baseSalary),
      hourlyRate: parseFloat(hourlyRate)
    };

    try {
      if (isUpdate) {
        const existing = baseSalaries.find(s => s.referenceId === referenceId);
        if (!existing) {
          alert('수정할 기준급이 없습니다.');
          return;
        }
        await axios.put(`/api/base-salaries/${existing.id}`, payload);
        alert('기준급이 수정되었습니다.');
        setBaseSalaries(prev =>
          prev.map(s => (s.id === existing.id ? { ...s, baseSalary, hourlyRate } : s))
        );
      } else {
        const res = await axios.post('/api/base-salaries', payload);
        alert('기준급이 등록되었습니다.');
        setBaseSalaries([...baseSalaries, res.data]);
      }
      setForm({ referenceId: '', baseSalary: '', hourlyRate: '' });
    } catch (err) {
      alert('처리 실패');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/base-salaries/${id}`);
      alert('삭제되었습니다.');
      setBaseSalaries(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert('삭제 실패');
      console.error(err);
    }
  };

  const inputStyle = {
    padding: '6px',
    marginRight: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const sectionStyle = {
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0,0,0,0.05)',
  };

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2>직급 기준급 관리</h2>

      <div style={sectionStyle}>
        <h3>기준급 등록/수정</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <SelectCombo
            options={positions.map(p => ({ value: p.positionId, label: p.positionName }))}
            value={form.referenceId}
            onChange={(v) => handleChange('referenceId', v)}
            searchable={true}
            required={true}
            placeholder="직급 선택"
          />
          <input
            placeholder="기본급"
            style={inputStyle}
            value={form.baseSalary}
            onChange={(e) => handleChange('baseSalary', e.target.value)}
          />
          <input
            type="number"
            placeholder="시급"
            style={inputStyle}
            value={form.hourlyRate}
            onChange={(e) => handleChange('hourlyRate', e.target.value)}
          />
          <button onClick={() => handleSubmit(false)}>등록</button>
          <button onClick={() => handleSubmit(true)}>수정</button>
        </div>

        <table border="1" cellPadding="8" style={{ width: '100%', backgroundColor: '#fff' }}>
          <thead>
            <tr>
              <th>직급</th>
              <th>기본급</th>
              <th>시급</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {baseSalaries.map((s) => {
              const pos = positions.find(p => p.positionId === s.referenceId);
              return (
                <tr key={s.id}>
                  <td>{pos?.positionName || s.referenceId}</td>
                  <td>{s.baseSalary.toLocaleString()}</td>
                  <td>{s.hourlyRate.toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleDelete(s.id)}>삭제</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BaseSalaryPage;
