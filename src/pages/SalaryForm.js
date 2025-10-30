import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import SelectCombo from "../sample/SelectCombo";

const SalaryForm = () => {
  const [form, setForm] = useState({
    memberId: '',
    position: '',
    baseSalary: '',
    hourlyRate: '',
    overtimeHours: '',
    salaryMonth: ''
  });

  const [positionOptions, setPositionOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [memberSalaries, setMemberSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posRes, memRes, memSalRes] = await Promise.all([
          axios.get('/api/base-salaries?type=POSITION'),
          axios.get('/member/list'),
          axios.get('/api/base-salaries?type=MEMBER')
        ]);

        setPositionOptions(posRes.data);
        setMemberSalaries(memSalRes.data);

        const memberComboOptions = memRes.data.map(m => ({
          value: m.id,
          label: `${m.name} (${m.id})`
        }));
        setMemberOptions(memberComboOptions);
      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
        alert('기본급 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMemberChange = (selectedId) => {
    const matched = memberSalaries.find(m => m.referenceId === selectedId);
    setForm(prev => ({
      ...prev,
      memberId: selectedId,
      baseSalary: matched ? matched.baseSalary : '',
      hourlyRate: matched ? matched.hourlyRate : ''
    }));
  };

  const handlePositionChange = (e) => {
    const selected = e.target.value;
    const matchedPosition = positionOptions.find(p => p.referenceId === selected);
    const matchedMember = memberSalaries.find(m => m.referenceId === form.memberId);

    if (!matchedMember && matchedPosition) {
      setForm({
        ...form,
        position: selected,
        baseSalary: matchedPosition.baseSalary,
        hourlyRate: matchedPosition.hourlyRate
      });
    } else {
      setForm({ ...form, position: selected });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      memberId: form.memberId,
      salaryMonth: form.salaryMonth,
      overtimeHours: parseFloat(form.overtimeHours || '0'),
      deductions: null
    };

    try {
      await axios.post('/api/salaries', payload, { withCredentials: true });
      alert('급여가 성공적으로 생성되었습니다.');
      setForm({
        memberId: '',
        position: '',
        baseSalary: '',
        hourlyRate: '',
        overtimeHours: '',
        salaryMonth: ''
      });
    } catch (err) {
      console.error('급여 생성 실패:', err);
      const msg = err.response?.data || '급여 생성 중 오류가 발생했습니다.';
      alert(typeof msg === 'string' ? msg : msg.message || '서버 오류');
    }
  };

  const totalSalary =
    parseFloat(form.baseSalary || 0) +
    parseFloat(form.hourlyRate || 0) * parseFloat(form.overtimeHours || 0);

  const containerStyle = {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f4f6f8',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    color: '#333'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0078d4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#222' }}>급여 생성</h2>
      {loading ? (
        <p>데이터를 불러오는 중입니다...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>사원</label>
            <SelectCombo
              label="사원 선택"
              options={memberOptions}
              value={form.memberId}
              onChange={handleMemberChange}
              searchable={true}
              required={true}
            />
          </div>

          <div>
            <label style={labelStyle}>직급</label>
            <select
              name="position"
              value={form.position}
              onChange={handlePositionChange}
              required
              style={inputStyle}
            >
              <option value="">직급 선택</option>
              {positionOptions.map(pos => (
                <option key={pos.referenceId} value={pos.referenceId}>
                  {pos.referenceId}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>급여 대상 월</label>
            <input
              name="salaryMonth"
              type="month"
              value={form.salaryMonth}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>기본급</label>
            <input
              name="baseSalary"
              type="number"
              value={form.baseSalary}
              readOnly
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>시급</label>
            <input
              name="hourlyRate"
              type="number"
              value={form.hourlyRate}
              readOnly
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>초과근무 시간</label>
            <input
              name="overtimeHours"
              type="number"
              value={form.overtimeHours}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {form.memberId && (
            <p style={{ marginBottom: '16px', color: '#0078d4' }}>
              예상 총급여: {totalSalary.toLocaleString()} 원
            </p>
          )}

          {!form.baseSalary && (
            <p style={{ color: 'red', marginBottom: '16px' }}>
              기준급 정보가 없습니다. 급여 생성을 위해 기준급을 먼저 등록해주세요.
            </p>
          )}

          {form.memberId && (
            <p style={{ color: memberSalaries.find(m => m.referenceId === form.memberId) ? '#0078d4' : '#666' }}>
              {memberSalaries.find(m => m.referenceId === form.memberId)
                ? '개인 기준급이 적용되었습니다.'
                : '직급 기준급이 적용되었습니다.'}
            </p>
          )}

          <button type="submit" style={buttonStyle} disabled={!form.baseSalary}>
            급여 생성
          </button>
        </form>
      )}
    </div>
  );
};

export default SalaryForm;
