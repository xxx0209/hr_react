// 회원 선택 시 급여 자동 적용
const handleMemberChange = (e) => {
  const memberId = e.target.value; // 문자열로 그대로 사용
  const member = members.find((m) => String(m.id) === memberId); // id를 문자열로 비교

  if (!member) {
    setForm({
      ...form,
      memberId: "",
      salaryType: "MEMBER",
      positionSalaryId: "",
      baseSalary: "",
      hourlyRate: "",
    });
    return;
  }

  if (member.memberSalary) {
    setForm({
      ...form,
      memberId,
      salaryType: "MEMBER",
      positionSalaryId: "",
      baseSalary: member.memberSalary.baseSalary,
      hourlyRate: member.memberSalary.hourlyRate,
    });
  } else if (member.positionId) {
    const position = positionSalaries.find((p) => String(p.id) === String(member.positionId));
    setForm({
      ...form,
      memberId,
      salaryType: "POSITION",
      positionSalaryId: position?.id || "",
      baseSalary: position?.baseSalary || "",
      hourlyRate: position?.hourlyRate || "",
    });
  } else {
    setForm({
      ...form,
      memberId,
      salaryType: "MEMBER",
      positionSalaryId: "",
      baseSalary: "",
      hourlyRate: "",
    });
  }
};
