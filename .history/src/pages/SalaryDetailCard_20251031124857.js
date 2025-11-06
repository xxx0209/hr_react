import React from 'react';

const SalaryDetailCard = ({ salary }) => {
  if (!salary) {
    return <p>급여 정보를 선택해주세요.</p>;
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{salary.salaryMonth} 급여 상세</h2>

      <div style={styles.row}>
        <span>기본급:</span>
        <strong>{Number(salary.customBaseSalary).toLocaleString()} 원</strong>
      </div>
      <div style={styles.row}>
        <span>초과근무 수당:</span>
        <strong>{Number(salary.hoursBaseSalary).toLocaleString()} 원</strong>
      </div>
      <div style={styles.row}>
        <span>총지급액:</span>
        <strong>{Number(salary.grossPay).toLocaleString()} 원</strong>
      </div>
      <div style={styles.row}>
        <span>실지급액:</span>
        <strong>{Number(salary.netPay).toLocaleString()} 원</strong>
      </div>
      <div style={styles.row}>
        <span>지급일:</span>
        <strong>{new Date(salary.payDate).toLocaleDateString()}</strong>
      </div>
      <div style={styles.row}>
        <span>급여 상태:</span>
        <strong>{salary.status}</strong>
      </div>

      {/* 🔻 공제 내역 */}
      {salary.deductions && salary.deductions.length > 0 && (
        <div style={styles.deductionSection}>
          <h4 style={styles.deductionTitle}>공제 내역</h4>
          <ul style={styles.deductionList}>
            {salary.deductions.map((d, idx) => (
              console.log('공제이름:', d.typeName);
              return()
              <li key={idx} style={styles.deductionItem}>
                <span>{d.typeName || '공제명 없음'}</span>
                <strong>{Number(d.amount).toLocaleString()} 원</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    padding: '24px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    fontFamily: 'Segoe UI, sans-serif'
  },
  title: {
    marginBottom: '20px',
    color: '#0078D4'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '16px',
    color: '#333'
  },
  deductionSection: {
    marginTop: '24px'
  },
  deductionTitle: {
    marginBottom: '12px',
    fontSize: '16px',
    color: '#0078D4'
  },
  deductionList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  deductionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '15px',
    color: '#555'
  }
};

export default SalaryDetailCard;
