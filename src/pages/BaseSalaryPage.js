import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BaseSalaryPage = () => {
  const [positionSalaries, setPositionSalaries] = useState([]);
  const [memberSalaries, setMemberSalaries] = useState([]);
  const [newPosition, setNewPosition] = useState({ referenceId: '', baseSalary: '', hourlyRate: '' });
  const [newMember, setNewMember] = useState({ referenceId: '', baseSalary: '', hourlyRate: '' });
  const [loading, setLoading] = useState(true);

  // 기준급 목록 불러오기
  useEffect(() => {
    Promise.all([
      axios.get('/api/base-salaries?type=POSITION', { withCredentials: true }),
      axios.get('/api/base-salaries?type=MEMBER', { withCredentials: true })
    ])
      .then(([posRes, memRes]) => {
        setPositionSalaries(posRes.data);
        setMemberSalaries(memRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('기준급 불러오기 실패:', err);
        alert('기준급 정보를 불러오지 못했습니다.');
        setLoading(false);
      });
  }, []);

  // 기준급 수정 핸들러
  const handleChange = (type, index, field, value) => {
    const list = type === 'POSITION' ? [...positionSalaries] : [...memberSalaries];
    list[index][field] = value;
    type === 'POSITION' ? setPositionSalaries(list) : setMemberSalaries(list);
  };

  // 저장
  const handleSave = () => {
    Promise.all([
      axios.put('/api/base-salaries', positionSalaries, { withCredentials: true }),
      axios.put('/api/base-salaries', memberSalaries, { withCredentials: true })
    ])
      .then(() => alert('기준급이 성공적으로 저장되었습니다.'))
      .catch(err => {
        console.error('기준급 저장 실패:', err);
        alert('저장 중 오류가 발생했습니다.');
      });
  };

  // 새 기준급 추가
  const handleAdd = (type) => {
    const target = type === 'POSITION' ? newPosition : newMember;
    if (!target.referenceId || !target.baseSalary || !target.hourlyRate) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const payload = {
      type,
      referenceId: target.referenceId,
      baseSalary: parseFloat(target.baseSalary),
      hourlyRate: parseFloat(target.hourlyRate)
    };

    axios.post('/api/base-salaries', payload, { withCredentials: true })
      .then(() => {
        if (type === 'POSITION') {
          setPositionSalaries([...positionSalaries, payload]);
          setNewPosition({ referenceId: '', baseSalary: '', hourlyRate: '' });
        } else {
          setMemberSalaries([...memberSalaries, payload]);
          setNewMember({ referenceId: '', baseSalary: '', hourlyRate: '' });
        }
        alert('기준급이 추가되었습니다.');
      })
      .catch(err => {
        console.error('기준급 추가 실패:', err);
        alert('추가 중 오류가 발생했습니다.');
      });
  };

  return (
    <div>
      <h2>기준급 설정</h2>

      {loading ? (
        <p>기준급 정보를 불러오는 중입니다...</p>
      ) : (
        <>
          {/* 직급 기준급 */}
          <h3>직급 기준급</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>직급명</th>
                <th>기본급</th>
                <th>시급</th>
              </tr>
            </thead>
            <tbody>
              {positionSalaries.map((pos, idx) => (
                <tr key={pos.referenceId}>
                  <td>{pos.referenceId}</td>
                  <td>
                    <input
                      type="number"
                      value={pos.baseSalary}
                      onChange={(e) => handleChange('POSITION', idx, 'baseSalary', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={pos.hourlyRate}
                      onChange={(e) => handleChange('POSITION', idx, 'hourlyRate', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '10px' }}>
            <input
              placeholder="새 직급명"
              value={newPosition.referenceId}
              onChange={(e) => setNewPosition({ ...newPosition, referenceId: e.target.value })}
            />
            <input
              placeholder="기본급"
              type="number"
              value={newPosition.baseSalary}
              onChange={(e) => setNewPosition({ ...newPosition, baseSalary: e.target.value })}
            />
            <input
              placeholder="시급"
              type="number"
              value={newPosition.hourlyRate}
              onChange={(e) => setNewPosition({ ...newPosition, hourlyRate: e.target.value })}
            />
            <button onClick={() => handleAdd('POSITION')}>직급 추가</button>
          </div>

          <hr />

          {/* 개인 기준급 */}
          <h3>개인 기준급</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>사원 ID</th>
                <th>기본급</th>
                <th>시급</th>
              </tr>
            </thead>
            <tbody>
              {memberSalaries.map((mem, idx) => (
                <tr key={mem.referenceId}>
                  <td>{mem.referenceId}</td>
                  <td>
                    <input
                      type="number"
                      value={mem.baseSalary}
                      onChange={(e) => handleChange('MEMBER', idx, 'baseSalary', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={mem.hourlyRate}
                      onChange={(e) => handleChange('MEMBER', idx, 'hourlyRate', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '10px' }}>
            <input
              placeholder="사원 ID"
              value={newMember.referenceId}
              onChange={(e) => setNewMember({ ...newMember, referenceId: e.target.value })}
            />
            <input
              placeholder="기본급"
              type="number"
              value={newMember.baseSalary}
              onChange={(e) => setNewMember({ ...newMember, baseSalary: e.target.value })}
            />
            <input
              placeholder="시급"
              type="number"
              value={newMember.hourlyRate}
              onChange={(e) => setNewMember({ ...newMember, hourlyRate: e.target.value })}
            />
            <button onClick={() => handleAdd('MEMBER')}>개인 기준급 추가</button>
          </div>

          <hr />
          <button onClick={handleSave}>전체 저장</button>
        </>
      )}
    </div>
  );
};

export default BaseSalaryPage;
