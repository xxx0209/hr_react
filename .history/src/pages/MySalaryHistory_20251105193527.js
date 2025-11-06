import React, { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Card } from 'react-bootstrap';
import axios from 'axios';

function SalaryPage() {
  const [salaries, setSalaries] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);

  const memberId = 'user123'; // 로그인한 회원 ID (실제 환경에서는 AuthContext 등에서 가져오기)

  useEffect(() => {
    axios.get(`/api/salaries/my?memberId=${memberId}`)
      .then(res => setSalaries(res.data))
      .catch(err => console.error(err));
  }, [memberId]);

  const selectSalary = (salaryId) => {
    axios.get(`/api/salaries/${salaryId}`)
      .then(res => setSelectedSalary(res.data))
      .catch(err => console.error(err));
  };

  return (
    <Row>
      {/* 좌측 리스트 */}
      <Col md={4}>
        <ListGroup>
          {salaries.map(s => (
            <ListGroup.Item key={s.salaryId} action onClick={() => selectSalary(s.salaryId)}>
              {s.salaryMonth} | 총급여: {s.grossPay} | 실급여: {s.netPay}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>

      {/* 우측 상세 */}
      <Col md={8}>
        {selectedSalary ? (
          <Card>
            <Card.Header>급여 상세 - {selectedSalary.salaryMonth}</Card.Header>
            <Card.Body>
              <p>지급일: {selectedSalary.payDate}</p>
              <p>기본급: {selectedSalary.baseSalary}</p>
              <p>초과수당: {selectedSalary.hoursBaseSalary}</p>
              <p>총급여: {selectedSalary.grossPay}</p>
              <p>총공제: {selectedSalary.totalDeduction}</p>
              <p>실급여: {selectedSalary.netPay}</p>
              <hr/>
              <h5>공제 내역</h5>
              <ListGroup>
                {selectedSalary.deductions.map(d => (
                  <ListGroup.Item key={d.typeCode}>
                    {d.typeName} ({d.rate * 100}%) : {d.amount}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        ) : (
          <p>좌측 리스트에서 급여를 선택하세요.</p>
        )}
      </Col>
    </Row>
  );
}

export default SalaryPage;
