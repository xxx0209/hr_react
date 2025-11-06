const SalaryDetailCard = ({ salary }) => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>{salary.salaryMonth} 급여 상세</h3>
      <p>기본급: {salary.customBaseSalary.toLocaleString()} 원</p>
      <p>초과근무 수당: {salary.hoursBaseSalary.toLocaleString()} 원</p>
      <p>총지급액: {salary.grossPay.toLocaleString()} 원</p>
      <p>실지급액: {salary.netPay.toLocaleString()} 원</p>
      <p>지급일: {new Date(salary.payDate).toLocaleDateString()}</p>
    </div>
  );
};
