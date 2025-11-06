import React, { useEffect, useState, useContext } from "react";
import { Table, Card, Spinner, Alert, Row, Col } from "react-bootstrap";
import axios from "../api/api";
import { AuthContext } from "../context/AuthContext"; // 로그인 정보

export default function MySalaryHistory() {
  const [list, setList] = useState([]); // 급여 목록
  const [selected, setSelected] = useState(null); // 선택된 급여 상세
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  // 로그인한 사용자 정보 가져오기
  const { user } = useContext(AuthContext);

  // ✅ 로그인한 사용자의 급여 목록 조회
  useEffect(() => {
    if (user) fetchMySalaries();
  }, [user]);

  // ✅ 승인된 급여 목록만 불러오기
  const fetchMySalaries = async () => {
    const res = await axios.get("/api/salaries/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
      setList(res.data);
    } catch (err) {
      console.error("급여 내역 로딩 실패", err);
      setError("급여 내역을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 급여 상세 조회
  const fetchMySalaryDetail = async (salaryId) => {
    try {
    setDetailLoading(true);
    const res = await axios.get(`/api/salaries/me/${salaryId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    } catch (err) {
      console.error("급여 상세 로딩 실패", err);
      setError("급여 상세정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setDetailLoading(false);
    }
  };

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
          {/* 왼쪽 급여 목록 */}
          <Col md={4}>
            <Card>
              <Card.Header className="fw-bold">📅 급여 내역</Card.Header>
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
                    {list.length > 0 ? (
                      list.map((s) => (
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

          {/* 오른쪽 급여 상세 */}
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
                      <strong>시급:</strong>{" "}
                      {selected.hourlyRate?.toLocaleString()} 원
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
