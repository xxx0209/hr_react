import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalaryForm = () => {
  const [form, setForm] = useState({
    memberId: '',
    position: '',
    baseSalary: '',
    hourlyRate: '',
    overtimeHours: ''
  });

  const [positionOptions, setPositionOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/base-salaries?type=POSITION', { withCredentials: true })
      .then(res => {
        setPositionOptions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('기본급 불러오기 실패:', err);
        alert('기본급 정보를 불러오지 못했습니다.');
        setLoading(false);
      });
  }, []);

  const handlePositionChange = (e) => {
    const selected = e.target.value;
    const matched = positionOptions.find(p => p.referenceId === selected);
    setForm({
      ...form,
      position: selected,
      baseSalary: matched ? matched.baseSalary : '',
      hourlyRate: matched ? matched.hourlyRate : ''
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      memberId: form.memberId,
      overtimeHours: form.overtimeHours ? parseFloat(form.overtimeHours) : 0,
      deductions: null
    };

    axios.post('/salaries', payload, { withCredentials: true })
      .then(() => {
        alert('급여가 성공적으로 생성되었습니다.');
        setForm({
          memberId: '',
          position: '',
          baseSalary: '',
          hourlyRate: '',
          overtimeHours: ''
        });
      })
      .catch(err => {
        console.error('급여 생성 실패:', err);
        alert('급여 생성 중 오류가 발생했습니다.');
      });
  };

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
        <p>직급 정보를 불러오는 중입니다...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>사원 ID</label>
            <input
              name="memberId"
              value={form.memberId}
              onChange={handleChange}
              required
              style={inputStyle}
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
            <label style={labelStyle}>기본급</label>
            <input
              name="baseSalary"
              type="number"
              value={form.baseSalary}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>시급</label>
            <input
              name="hourlyRate"
              type="number"
              value={form.hourlyRate}
              onChange={handleChange}
              required
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

          <button type="submit" style={buttonStyle}>급여 생성</button>
        </form>
      )}
    </div>
  );
};

export default SalaryForm;
