import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  ProgressBar,
  Badge,
  Form,
  Button,
  Card,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ArrowUpRight } from "react-bootstrap-icons";
import api from "../api/api";

export default function VacationPage() {
  const [user, setUser] = useState(null);
  const [vacations, setVacations] = useState([]);
  const [filteredVacations, setFilteredVacations] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const TOTAL_VACATION_DAYS = 15;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/user/me");
        setUser(userRes.data);

        const reqRes = await api.get("/api/requests");
        const approved = reqRes.data.filter(
          (r) =>
            r.requestType === "휴가" &&
            r.status === "승인" &&
            r.memberId === userRes.data.memberId
        );
        setVacations(approved);
        setFilteredVacations(approved);
      } catch (err) {
        console.error("휴가 데이터 불러오기 실패:", err);
      }
    };
    fetchData();
  }, []);

  const usedDays = filteredVacations.reduce((sum, v) => {
    const start = new Date(v.startDate);
    const end = new Date(v.endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const count = v.vacationType === "반차" ? 0.5 : diff;
    return sum + count;
  }, 0);

  const remainingDays = TOTAL_VACATION_DAYS - usedDays;
  const percentUsed = Math.min(
    Math.round((usedDays / TOTAL_VACATION_DAYS) * 100),
    100
  );

  const today = new Date();
  const upcoming = filteredVacations.filter(
    (v) => new Date(v.startDate) >= today
  );
  const past = filteredVacations.filter((v) => new Date(v.startDate) < today);

  // 최대 3건만 표시
  const limitedUpcoming = upcoming.slice(0, 3);
  const limitedPast = past.slice(0, 3);

  const getMonthKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  const monthlyStats = filteredVacations.reduce((acc, v) => {
    const month = getMonthKey(v.startDate);
    const start = new Date(v.startDate);
    const end = new Date(v.endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const count = v.vacationType === "반차" ? 0.5 : diff;

    if (!acc[month]) acc[month] = { month, days: 0, count: 0 };
    acc[month].days += count;
    acc[month].count += 1;
    return acc;
  }, {});

  const chartData = Array.from({ length: 12 }, (_, i) => {
    const key = `${selectedYear}-${String(i + 1).padStart(2, "0")}`;
    return {
      month: `${i + 1}월`,
      days: monthlyStats[key]?.days || 0,
      count: monthlyStats[key]?.count || 0,
    };
  });

  const handleFilter = () => {
    const filtered = vacations.filter(
      (v) => new Date(v.startDate).getFullYear() === Number(selectedYear)
    );
    setFilteredVacations(filtered);
  };

  const resetFilter = () => {
    setFilteredVacations(vacations);
    setSelectedYear(new Date().getFullYear());
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4 fw-bold text-primary">🏖 휴가현황</h3>

      {/* 요약 영역 */}
      <Card className="shadow-sm p-3 mb-4 border-0 rounded-4">
        <Row className="align-items-center">
          <Col md={4}>
            <h5 className="mb-0">{user?.name}님</h5>
            <div className="text-muted small">{user?.department}</div>
          </Col>
          <Col md={8}>
            <ProgressBar
              now={percentUsed}
              variant={
                percentUsed >= 90
                  ? "danger"
                  : percentUsed >= 60
                    ? "warning"
                    : "success"
              }
              label={`${percentUsed}% 사용`}
              style={{ height: "18px", fontWeight: "600" }}
              animated
            />
            <div className="d-flex justify-content-between mt-2 text-muted small">
              <span>사용 {usedDays.toFixed(1)}일</span>
              <span>잔여 {remainingDays.toFixed(1)}일</span>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 예정 / 지난 휴가 */}
      <Row className="mb-2">
        {/* 예정 휴가 */}
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-4 p-3 position-relative">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-semibold mb-0">📅 예정 휴가</h5>
              {upcoming.length > 3 && (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>휴가 내역 보기</Tooltip>}
                >
                  <Button
                    variant="link"
                    className="p-0 text-muted"
                    onClick={() => {
                      // ‘휴가내역’ 탭으로 이동 + 상태 전달
                      navigate("/vacation/history", {
                        state: { activeMenu: "vacation", activeSub: "휴가내역" },
                      });
                    }}
                    style={{ fontSize: "1.1rem" }}
                  >
                    <ArrowUpRight />
                  </Button>
                </OverlayTrigger>
              )}
            </div>

            <Table hover responsive className="align-middle mt-2">
              <thead className="table-light">
                <tr>
                  <th>종류</th>
                  <th>기간</th>
                  <th>일수</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {limitedUpcoming.length === 0 ? (
                  <tr key="empty">
                    <td colSpan={4} className="text-center text-muted">
                      예정된 휴가가 없습니다.
                    </td>
                  </tr>
                ) : (
                  limitedUpcoming.map((v) => {
                    const start = new Date(v.startDate).toLocaleDateString();
                    const end = new Date(v.endDate).toLocaleDateString();
                    const days =
                      v.vacationType === "반차"
                        ? "0.5일"
                        : `${Math.ceil(
                          (new Date(v.endDate) - new Date(v.startDate)) /
                          (1000 * 60 * 60 * 24)
                        ) + 1}일`;
                    return (
                      <tr key={v.requestId}>
                        <td>{v.vacationType}</td>
                        <td>{`${start} ~ ${end}`}</td>
                        <td>{days}</td>
                        <td>
                          <Badge bg="success">승인</Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </Card>
        </Col>

        {/* 지난 휴가 */}
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-4 p-3 position-relative">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-semibold mb-0">🕒 지난 휴가</h5>
              {past.length > 3 && (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>휴가 내역 보기</Tooltip>}
                >
                  <Button
                    variant="link"
                    className="p-0 text-muted"
                    onClick={() => navigate("/vacation/history")}
                    style={{ fontSize: "1.1rem" }}
                  >
                    <ArrowUpRight />
                  </Button>
                </OverlayTrigger>
              )}
            </div>

            <Table hover responsive className="align-middle mt-2">
              <thead className="table-light">
                <tr>
                  <th>종류</th>
                  <th>기간</th>
                  <th>일수</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {limitedPast.length === 0 ? (
                  <tr key="empty">
                    <td colSpan={4} className="text-center text-muted">
                      지난 휴가가 없습니다.
                    </td>
                  </tr>
                ) : (
                  limitedPast.map((v, index) => {
                    const start = new Date(v.startDate).toLocaleDateString();
                    const end = new Date(v.endDate).toLocaleDateString();
                    const days =
                      v.vacationType === "반차"
                        ? "0.5일"
                        : `${Math.ceil(
                          (new Date(v.endDate) - new Date(v.startDate)) /
                          (1000 * 60 * 60 * 24)
                        ) + 1}일`;
                    return (
                      <tr key={index}>
                        <td>{v.vacationType}</td>
                        <td>{`${start} ~ ${end}`}</td>
                        <td>{days}</td>
                        <td>
                          <Badge bg="secondary">완료</Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      {/* 그래프 영역 */}
      <Card className="shadow-sm border-0 rounded-4 p-3 mt-1">
        <Row className="align-items-end mb-2">
          <Col md={2}>
            <Form.Label className="fw-semibold small">조회 연도</Form.Label>
            <Form.Control
              size="sm"
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Button
              size="sm"
              variant="primary"
              className="me-2"
              onClick={handleFilter}
            >
              적용
            </Button>
            <Button size="sm" variant="outline-secondary" onClick={resetFilter}>
              초기화
            </Button>
          </Col>
        </Row>

        <h6 className="fw-semibold mb-2">📊 월별 휴가 통계</h6>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007bff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#007bff" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c9a7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00c9a7" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <ReTooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: "10px",
                border: "1px solid #ddd",
                fontSize: "0.8rem",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
            <Line
              type="monotone"
              dataKey="days"
              name="사용 일수"
              stroke="url(#colorDays)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="count"
              name="휴가 건수"
              stroke="url(#colorCount)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Container>
  );
}
