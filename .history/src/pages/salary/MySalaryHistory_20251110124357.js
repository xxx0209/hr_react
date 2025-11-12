import React, { useEffect, useState, useContext } from "react";
import { Table, Card, Spinner, Alert, Row, Col, Form } from "react-bootstrap";
import axios from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function MySalaryHistory() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [yearFilter, setYearFilter] = useState(""); // 선택된 년도

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.memberId) {
      fetchMySalaries(user.memberId);
    }
  }, [user]);

  const fetchMySalaries = async (memberId) => {
    try {
      const res = await axios.get("/api/salaries/me", {
        params: { memberId },
      });
      setList(res.data);
    } catch (err) {
      console.error("급여 내역 로딩 실패", err);
      setError("급여 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMySalaryDetail = async (salaryId) => {
    try {
      setDetailLoading(true);
      const res = await axios.get(`/api/salaries/me/${salaryId}`, {
        params: { memberId: user.memberId },
      });
      setSelected(res.data);
    } catch (err) {
      console.error("급여 상세 로딩 실패", err);
      setError("급여 상세정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setDetailLoading(false);
    }
  };

  // 년도 선택 시 필터링
  const filteredList = yearFilter
    ? list.filter((s) => (s.salaryMonth || s.payDate)?.startsWith(yearFilter))
    : list;

  // 년도 목록 자동 생성
  const years = Array.from(
    new Set(list.map((s) => (s.salaryMonth || s.payDate)?.slice(0, 4)))
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4">💼 나의 급여 내역</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          <Col md={4}>
            <Card>
              <Card.Header className="fw-bold">
                📅 급여 내역
                <Form.Select
                  className="mt-2"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <option value="">전체</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}년
                    </option>
                  ))}
                </Form.Select>
              </Card.Header>
              <Card.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>급여월</th>
                      <th>지급일</th>
                      <th>실지급액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length > 0 ? (
                      filteredList.map((s) => (
                        <tr
                          key={s.salaryId}
                          onClick={() => fetchMySalaryDetail(s.salaryId)}
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              selected?.salaryId === s.salaryId
                                ? "#eef6ff"
                                : "transparent",
                          }}
                        >
                          <td>{s.salaryMonth || s.payDate?.slice(0, 7)}</td>
                          <td>{s.payDate || "-"}</td>
                          <td>{s.netPay?.toLocaleString()} 원</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-muted">
                          승인된 급여 내역이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card>
              <Card.Header className="fw-bold">📋 상세 급여 정보</Card.Header>
              <Card.Body>
                {detailLoading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                  </div>
                ) : selected ? (
                  <>
                    <h5>
                      {selected.salaryMonth || selected.payDate?.slice(0, 7)} 급여
                    </h5>
                    <p>
                      <strong>지급일:</strong> {selected.payDate}
                    </p>
                    <p>
                      <strong>기본급:</strong>{" "}
                      {selected.baseSalary?.toLocaleString()} 원
                    </p>
                    <p>
                      <strong>시급:</strong> {selected.hourlyRate?.toLocaleString()} 원
                    </p>
                    <p>
                      <strong>추가 수당:</strong> {selected.hoursBaseSalary?.toLocaleString()} 원
                    </p>
                    <p>
                      <strong>총 지급액:</strong>{" "}
                      {selected.grossPay?.toLocaleString()} 원
                    </p>
                    <p>
                      <strong>총 공제액:</strong>{" "}
                      {selected.totalDeduction?.toLocaleString()} 원
                    </p>
                    <p>
                      <strong>실지급액:</strong>{" "}
                      <span className="text-success fw-bold">
                        {selected.netPay?.toLocaleString()} 원
                      </span>
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
                        {selected.deductions?.length > 0 ? (
                          selected.deductions.map((d, idx) => (
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
                  <div className="text-muted">왼쪽에서 급여를 선택하세요.</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
