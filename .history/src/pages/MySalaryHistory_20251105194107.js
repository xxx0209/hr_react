import React, { useEffect, useState } from "react";
import { Table, Row, Col, Card, Spinner } from "react-bootstrap";
import axios from "../api/api";

export default function MySalaryHistory() {
  const [salaries, setSalaries] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMySalaries();
  }, []);

  // 로그인한 회원의 급여 내역 조회
  const fetchMySalaries = async () => {
    try {
      const res = await axios.get("/api/salaries/me");
      setSalaries(res.data);
    } catch (err) {
      console.error(err);
      setError("급여 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 급여 상세 조회
  const fetchSalaryDetail = async (salaryId) => {
    try {
      setLoadingDetail(true);
      const res = await axios.get(`/api/salaries/me/${salaryId}`);
      setSelectedSalary(res.data);
    } catch (err) {
      console.error(err);
      setError("급여 상세 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoadingDetail(false);
    }
  };

  if (loading) return <Spinner animation="border" className="m-5" />;
  if (error) return <div className="text-danger text-center mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">💼 나의 급여 내역</h3>
      <Row>
        {/* 왼쪽: 급여 리스트 */}
        <Col md={4}>
          <Card>
            <Card.Header className="fw-bold">📅 급여 내역 (최신순)</Card.Header>
            <Card.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
              <Table hover responsive size="sm">
                <thead>
                  <tr>
                    <th>월</th>
                    <th>지급일</th>
                    <th>실지급액</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-muted">
                        급여 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    salaries.map((s) => (
                      <tr
                        key={s.salaryId}
                        onClick={() => fetchSalaryDetail(s.salaryId)}
                        style={{
                          cursor: "pointer",
                          backgroundColor:
                            selectedSalary?.salaryId === s.salaryId ? "#e9f5ff" : "",
                        }}
                      >
                        <td>{s.salaryMonth || s.payDate?.slice(0, 7)}</td>
                        <td>{s.payDate}</td>
                        <td>{s.netPay?.toLocaleString()} 원</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* 오른쪽: 상세 정보 */}
        <Col md={8}>
          <Card>
            <Card.Header className="fw-bold">📋 상세 급여 정보</Card.Header>
            <Card.Body>
              {loadingDetail ? (
                <Spinner animation="border" />
              ) : selectedSalary ? (
                <>
                  <h5>
                    {selectedSalary.salaryMonth || selectedSalary.payDate?.slice(0, 7)} 급여
                  </h5>
                  <p>
                    <strong>지급일:</strong> {selectedSalary.payDate}
                  </p>
                  <p>
                    <strong>총지급액:</strong>{" "}
                    {selectedSalary.grossPay?.toLocaleString()} 원
                  </p>
                  <p>
                    <strong>총 공제액:</strong>{" "}
                    {selectedSalary.totalDeduction?.toLocaleString()} 원
                  </p>
                  <p>
                    <strong>실지급액:</strong>{" "}
                    {selectedSalary.netPay?.toLocaleString()} 원
                  </p>

                  <hr />
                  <h6>💰 공제 상세 내역</h6>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>항목</th>
                        <th>율(%)</th>
                        <th>금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSalary.deductions && selectedSalary.deductions.length > 0 ? (
                        selectedSalary.deductions.map((d, idx) => (
                          <tr key={idx}>
                            <td>{d.typeName}</td>
                            <td>{(d.rate * 100).toFixed(2)}%</td>
                            <td>{d.amount?.toLocaleString()} 원</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center text-muted">
                            공제 내역이 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </>
              ) : (
                <div className="text-muted">왼쪽에서 급여 내역을 선택해주세요.</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
