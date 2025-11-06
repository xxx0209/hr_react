import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, Card, Spinner } from "react-bootstrap";
import axios from "../api/api";

export default function MySalaryPage({ memberId }) {
  const [salaries, setSalaries] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ✅ 급여 리스트 가져오기
  const fetchSalaries = async () => {
    setLoadingList(true);
    try {
      const res = await axios.get(`/api/salaries/my-completed`, {
        params: { memberId },
      });
      setSalaries(res.data);
      if (res.data.length > 0) {
        fetchSalaryDetail(res.data[0].salaryId); // 첫 번째 급여 상세 자동 선택
      }
    } catch (err) {
      console.error("급여 리스트 조회 실패", err);
    } finally {
      setLoadingList(false);
    }
  };

  // ✅ 선택한 급여 상세 가져오기
  const fetchSalaryDetail = async (salaryId) => {
    setLoadingDetail(true);
    try {
      const res = await axios.get(`/api/salaries/my-completed/${salaryId}`, {
        params: { memberId },
      });
      setSelectedSalary(res.data);
    } catch (err) {
      console.error("급여 상세 조회 실패", err);
      setSelectedSalary(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [memberId]);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">💰 내 급여 내역</h3>
      <Row>
        {/* 왼쪽 4: 급여 리스트 */}
        <Col md={4}>
          <h5>급여 리스트</h5>
          {loadingList ? (
            <Spinner animation="border" />
          ) : (
            <ListGroup>
              {salaries.map((s) => (
                <ListGroup.Item
                  key={s.salaryId}
                  action
                  active={selectedSalary?.salaryId === s.salaryId}
                  onClick={() => fetchSalaryDetail(s.salaryId)}
                >
                  {s.salaryMonth} - {s.netPay?.toLocaleString()}원
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        {/* 오른쪽 8: 급여 상세 */}
        <Col md={8}>
          <h5>급여 상세</h5>
          {loadingDetail ? (
            <Spinner animation="border" />
          ) : selectedSalary ? (
            <Card>
              <Card.Body>
                <p><strong>회원명:</strong> {selectedSalary.memberName}</p>
                <p><strong>급여월:</strong> {selectedSalary.salaryMonth}</p>
                <p><strong>급여유형:</strong> {selectedSalary.salaryType}</p>
                <p><strong>기본급:</strong> {selectedSalary.baseSalary?.toLocaleString()}원</p>
                <p><strong>시급:</strong> {selectedSalary.hourlyRate?.toLocaleString()}원</p>
                <p><strong>총 근무시간:</strong> {selectedSalary.hoursBaseSalary}</p>
                <p><strong>총 급여:</strong> {selectedSalary.grossPay?.toLocaleString()}원</p>
                <p><strong>공제 합계:</strong> {selectedSalary.totalDeduction?.toLocaleString()}원</p>
                <p><strong>실수령액:</strong> {selectedSalary.netPay?.toLocaleString()}원</p>
                <p><strong>지급일:</strong> {selectedSalary.payDate}</p>
                <p><strong>상태:</strong> {selectedSalary.status}</p>
              </Card.Body>
            </Card>
          ) : (
            <p>급여 내역이 없습니다.</p>
          )}
        </Col>
      </Row>
    </div>
  );
}
