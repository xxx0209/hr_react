import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import SelectCombo from '../sample/SelectCombo';

const BaseSalaryPage = () => {
  const [type, setType] = useState('POSITION'); // 기준급 타입
  const [referenceOptions, setReferenceOptions] = useState([]);
  const [baseSalaries, setBaseSalaries] = useState([]);
  const [form, setForm] = useState({ referenceId: '', baseSalary: '', hourlyRate: '' });
  const [loading, setLoading] = useState(true);

  const getApiPath = () => {
    return type === 'POSITION' ? '/api/position-salaries' : '/api/member-salaries';
  };

  useEffect(() => {
    const fetchReferenceOptions = async () => {
      try {
        const res = type === 'POSITION'
          ? await axios.get('/position/all')
          : await axios.get('/member/list');
        const options = res.data.map(item => ({
          value: type === 'POSITION' ? item.positionName : item.id,
          label: type === 'POSITION' ? item.positionName : `${item.name} (${item.id})`
        }));
        setReferenceOptions(options);
      } catch (err) {
        alert('기준 정보 불러오기 실패');
        console.error(err);
      }
    };

    const fetchBaseSalaries = async () => {
      try {
        const res = await axios.get(getApiPath());
        setBaseSalaries(res.data);
      } catch (err) {
        alert('기준급 불러오기 실패');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    setBaseSalaries([]); // 타입 변경 시 초기화
    fetchReferenceOptions();
    fetchBaseSalaries();
  }, [type]);

  const resetForm = () => {
    setForm({ referenceId: '', baseSalary: '', hourlyRate: '' });
  };

  const handleSave = async () => {
    const { referenceId, baseSalary, hourlyRate } = form;
    if (!referenceId || baseSalary === '' || hourlyRate === '') {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const existing = baseSalaries.find(s => {
      if (type === 'POSITION') {
        return s?.position?.positionName === referenceId;
      } else {
        return s?.member?.id === referenceId;
      }
    });

    const payload = {
      baseSalary: parseFloat(baseSalary),
      hourlyRate: parseFloat(hourlyRate),
      ...(type === 'POSITION' ? { positionName: referenceId } : { memberId: referenceId })
    };

    try {
      if (existing) {
        await axios.put(`${getApiPath()}/${existing.id}`, payload);
        alert('기준급이 수정되었습니다.');
        setBaseSalaries(prev =>
          prev.map(s => s.id === existing.id ? { ...s, baseSalary: payload.baseSalary, hourlyRate: payload.hourlyRate } : s)
        );
      } else {
        const res = await axios.post(getApiPath(), payload);
        alert('기준급이 등록되었습니다.');
        setBaseSalaries([...baseSalaries, res.data]);
      }
      resetForm();
    } catch (err) {
      alert('처리 실패');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`${getApiPath()}/${id}`);
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
    width: '120px'
  };

  const buttonStyle = {
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#0078d4',
    color: '#fff',
    cursor: 'pointer'
  };

  if (loading) return <p>불러오는 중...</p>;

  const isExisting = baseSalaries.some(s => {
    if (type === 'POSITION') {
      return s?.position?.positionName === form.referenceId;
    } else {
      return s?.member?.id === form.referenceId;
    }
  });

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2>기준급 관리</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>기준급 타입: </label>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="POSITION">직급 기준</option>
          <option value="MEMBER">사원 기준</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <SelectCombo
          options={referenceOptions}
          value={form.referenceId}
          onChange={v => setForm({ ...form, referenceId: v })}
          searchable
          required
          placeholder={type === 'POSITION' ? '직급 선택' : '사원 선택'}
        />
        <input
          type="number"
          min="0"
          placeholder="기본급"
          style={inputStyle}
          value={form.baseSalary}
          onChange={e => setForm({ ...form, baseSalary: e.target.value })}
        />
        <input
          type="number"
          min="0"
          placeholder="시급"
          style={inputStyle}
          value={form.hourlyRate}
          onChange={e => setForm({ ...form, hourlyRate: e.target.value })}
        />
        <button style={buttonStyle} onClick={handleSave}>
          {isExisting ? '수정' : '등록'}
        </button>
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', backgroundColor: '#fff' }}>
        <thead>
          <tr>
            <th>{type === 'POSITION' ? '직급' : '사원'}</th>
            <th>기본급</th>
            <th>시급</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {baseSalaries.map((s, idx) => {
            const refId = type === 'POSITION' ? s?.position?.positionName : s?.member?.id;
            const label = referenceOptions.find(r => r.value === refId)?.label || refId;
            return (
              <tr key={s.id || idx}>
                <td>{label}</td>
                <td>{s.baseSalary.toLocaleString()}</td>
                <td>{s.hourlyRate.toLocaleString()}</td>
                <td>
                  <button
                    style={{ ...buttonStyle, backgroundColor: '#d32f2f' }}
                    onClick={() => handleDelete(s.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BaseSalaryPage;
