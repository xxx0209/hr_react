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
