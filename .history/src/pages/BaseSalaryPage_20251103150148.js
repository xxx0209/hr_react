import React, { useContext, useEffect, useState } from 'react';
import axios from '../api/api';
import SelectCombo from "../sample/SelectCombo";
import { EnumContext } from "../context/EnumContext";

const BaseSalaryPage = () => {
  const enums = useContext(EnumContext);

  const [positions, setPositions] = useState([]);
  const [positionSalaries, setPositionSalaries] = useState([]);
  const [newPositionSalary, setNewPositionSalary] = useState({ referenceId: '', baseSalary: '', hourlyRate: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [posRes, salRes] = await Promise.all([
          axios.get('/position/all'),
          axios.get('/api/position-salaries'),
        ]);
        setPositions(posRes.data);
        setPositionSalaries(salRes.data);
      } catch (err) {
        alert('데이터 불러오기 실패');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleAddSalary = async () => {
    const { referenceId, baseSalary, hourlyRate } = newPositionSalary;
    if (!referenceId || !baseSalary || !hourlyRate) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const payload = {
      positionId: referenceId,
      baseSalary: parseFloat(baseSalary),
      hourlyRate: parseFloat(hourlyRate),
    };

    try {
      const res = await axios.post('/api/position-salaries', payload);
      alert('기준급이 등록되었습니다.');
      setPositionSalaries([...positionSalaries, res.data]);
      setNewPositionSalary({ referenceId: '', baseSalary: '', hourlyRate: '' });
    } catch (err) {
      alert('등록 실패');
      console.error(err);
    }
  };

  const handleUpdateSalary = async () => {
    const { referenceId, baseSalary, hourlyRate } = newPositionSalary;
    const existing = positionSalaries.find(s => s.positionId === referenceId);
    if (!existing) {
      alert('수정할 기준급이 없습니다.');
      return;
    }

    try {
      await axios.put(`/api/position-salaries/${existing.id}`, {
        positionId: referenceId,
        baseSalary: parseFloat(baseSalary),
        hourlyRate: parseFloat(hourlyRate),
      });
      alert('기준급이 수정되었습니다.');
      const updatedList = positionSalaries.map(s =>
        s.id === existing.id ? { ...s, baseSalary, hourlyRate } : s
      );
      setPositionSalaries(updatedList);
    } catch (err) {
      alert('수정 실패');
      console.error(err);
    }
  };

  const handleDeleteSalary = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/position-salaries/${id}`);
      alert('삭제되었습니다.');
      setPositionSalaries(prev => prev.filter(s => s.id !== id));
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
      <h2>직급 기준급 등록</h2>

      <div style={sectionStyle}>
        <h3>기준급 등록</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <SelectCombo
            options={positions}
            value={newPositionSalary.referenceId}
            onChange={(v) => setNewPositionSalary({ ...newPositionSalary, referenceId: v })}
            searchable={true}
            required={true}
            placeholder="직급 선택"
          />
          <input
            type="number"
            placeholder="기본급"
            style={inputStyle}
            value={newPositionSalary.baseSalary}
            onChange={(e) => setNewPositionSalary({ ...newPositionSalary, baseSalary: e.target.value })}
          />
          <input
            type="number"
            placeholder="시급"
            style={inputStyle}
            value={newPositionSalary.hourlyRate}
            onChange={(e) => setNewPositionSalary({ ...newPositionSalary, hourlyRate: e.target.value })}
          />
          <button onClick={handleAddSalary}>등록</button>
          <button onClick={handleUpdateSalary}>수정</button>
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
            {positionSalaries.map((s, idx) => {
              const pos = positions.find(p => p.positionId === s.positionId);
              return (
                <tr key={s.id || idx}>
                  <td>{pos?.positionName || s.positionId}</td>
                  <td>{s.baseSalary.toLocaleString()}</td>
                  <td>{s.hourlyRate.toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleDeleteSalary(s.id)}>삭제</button>
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
