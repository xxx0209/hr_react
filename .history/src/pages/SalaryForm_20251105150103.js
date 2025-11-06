<Col md={6}>
  <Form.Group>
    {form.salaryType === "POSITION" ? (
      <Form.Group>
        <Form.Label>직급 급여 선택</Form.Label>
        <Form.Select
          name="positionSalaryId"
          value={form.positionSalaryId}
          onChange={handlePositionSalaryChange}  // 선택 시 기준급, 시급 자동 적용
        >
          <option value="">선택</option>
          {positionSalaries.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.baseSalary}원, 시급 {p.hourlyRate}원)
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    ) : (
      <Form.Group>
        <Form.Label>회원 급여 선택</Form.Label>
        <Form.Select
          name="memberSalaryId"
          value={form.memberSalaryId}
          onChange={handleMemberSalaryChange} // 선택 시 기준급, 시급 자동 적용
        >
          <option value="">선택</option>
          {membersSalaries.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title} ({m.baseSalary}원, 시급 {m.hourlyRate}원)
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    )}
  </Form.Group>
</Col>
