import React, { useContext, useEffect, useState } from 'react';
import axios from '../api/api';
import SelectCombo from "../sample/SelectCombo";
import { EnumContext } from "../context/EnumContext";
const BaseSalaryPage = () => {
  const enums = useContext(EnumContext);

  const [selectedType, setSelectedType] = useState('POSITION');
  const [positions, setPositions] = useState([]);
  const [members, setMembers] = useState([]);
  const [positionSalaries, setPositionSalaries] = useState([]);
  const [memberSalaries, setMemberSalaries] = useState([]);
  const [newPositionSalary, setNewPositionSalary] = useState({ referenceId: '', baseSalary: '', hourlyRate: '' });
  const [newMemberSalary, setNewMemberSalary] = useState({ referenceId: '', baseSalary: '', hourlyRate: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [posRes, memRes, posSalRes, memSalRes] = await Promise.all([
          axios.get('/position/all'),
          axios.get('/member/list'),
          axios.get('/api/base-salaries?type=POSITION'),
          axios.get('/api/base-salaries?type=MEMBER'),
        ]);
        setPositions(posRes.data);
        setMembers(memRes.data);
        setPositionSalaries(posSalRes.data);
        setMemberSalaries(memSalRes.data);
      } catch (err) {
        alert('데이터 불러오기 실패');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleAddSalary = async (type) => {
    const target = type === 'POSITION' ? newPositionSalary : newMemberSalary;
    if (!target.referenceId || !target.baseSalary || !target.hourlyRate) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const payload = {
      type,
      referenceId: target.referenceId,
      baseSalary: parseFloat(target.baseSalary),
      hourlyRate: parseFloat(target.hourlyRate),
    };

    try {
      const res = await axios.post('/api/base-salaries', payload);
      const saved = res.data;
      alert('기준급이 등록되었습니다.');
      if (type === 'POSITION') {
        setPositionSalaries([...positionSalaries, saved]);
        setNewPositionSalary({ referenceId: '', baseSalary: '', hourlyRate: '' });
      } else {
        setMemberSalaries([...memberSalaries, saved]);
        setNewMemberSalary({ referenceId: '', baseSalary: '', hourlyRate: '' });
      }
    } catch (err) {
      alert('등록 실패');
      console.error(err);

    }
  };

  const handleUpdateSalary = async (type) => {
    const target = type === 'POSITION' ? newPositionSalary : newMemberSalary;
    const list = type === 'POSITION' ? positionSalaries : memberSalaries;
    const existing = list.find(s => s.referenceId === target.referenceId);
    if (!existing) {
      alert('수정할 기준급이 없습니다.');
      return;
    }

    try {
      await axios.put(`/api/base-salaries/${existing.id}`, {
        type,
        referenceId: target.referenceId,
        baseSalary: parseFloat(target.baseSalary),
        hourlyRate: parseFloat(target.hourlyRate),
      });
      alert('기준급이 수정되었습니다.');
      const updatedList = list.map(s =>
        s.id === existing.id ? { ...s, baseSalary: target.baseSalary, hourlyRate: target.hourlyRate } : s
      );
      type === 'POSITION' ? setPositionSalaries(updatedList) : setMemberSalaries(updatedList);
    } catch (err) {
      alert('수정 실패');
      console.error(err);
    }
  };

  const handleDeleteSalary = async (id, type) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/base-salaries/${id}`);
      alert('삭제되었습니다.');
      type === 'POSITION'
        ? setPositionSalaries(prev => prev.filter(s => s.id !== id))
        : setMemberSalaries(prev => prev.filter(s => s.id !== id));
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
      <h2>기준급 등록</h2>

      <div style={{ marginBottom: '20px' }}>
        <SelectCombo
          options={enums?.BaseSalaryType || []}
          value={selectedType}
          onChange={(v) => setSelectedType(v)}
          searchable={false}
          placeholder="기준급 타입 선택"
        />
      </div>

      {selectedType === 'POSITION' && (
        <div style={sectionStyle}>
          <h3>직급 기준급 등록</h3>
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
            <button onClick={() => handleAddSalary('POSITION')}>등록</button>
            <button onClick={() => handleUpdateSalary('POSITION')}>수정</button>
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
                const pos = positions.find(p => p.positionCode === s.referenceId);
                return (
                  <tr key={s.id || idx}>
                    <td>{pos?.name}</td>
                    <td>{s.baseSalary.toLocaleString()}</td>
                    <td>{s.hourlyRate.toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleDeleteSalary(s.id, 'POSITION')}>삭제</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedType === 'MEMBER' && (
        <div style={sectionStyle}>
          <h3>개인 기준급 등록</h3>
          <p style={{ color: '#666' }}>※ 개인 기준급이 설정된 사원은 직급 기준급보다 우선 적용됩니다.</p>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <SelectCombo
              options={members}
              value={newMemberSalary.referenceId}
              onChange={(v) => setNewMemberSalary({ ...newMemberSalary, referenceId: v })}
              searchable={true}
              required={true}
              placeholder="사원 선택"
            />
            <input
              type="number"
              placeholder="기본급"
              style={inputStyle}
              value={newMemberSalary.baseSalary}
              onChange={(e) => setNewMemberSalary({ ...newMemberSalary, baseSalary: e.target.value })}
            />
            <input
              type="number"
              placeholder="시급"
              style={inputStyle}
              value={newMemberSalary.hourlyRate}
              onChange={(e) => setNewMemberSalary({ ...newMemberSalary, hourlyRate: e.target.value })}
            />
            <button onClick={() => handleAddSalary('MEMBER')}>등록</button>
            <button onClick={() => handleUpdateSalary('MEMBER')}>수정</button>
          </div>

          <table border="1" cellPadding="8" style={{ width: '100%', backgroundColor: '#fff' }}>
            <thead>
              <tr>
                <th>사원</th>
                <th>기본급</th>
                <th>시급</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {memberSalaries.map((s, idx) => {
                const mem = members.find(m => m.id === s.referenceId);
                return (
                  <tr key={s.id || idx}>
                    <td>{mem?.name || s.referenceId}</td>
                    <td>{s.baseSalary.toLocaleString()}</td>
                    <td>{s.hourlyRate.toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleDeleteSalary(s.id, 'MEMBER')}>삭제</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BaseSalaryPage;
