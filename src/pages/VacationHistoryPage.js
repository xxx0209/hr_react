import React, { useState, useEffect } from "react";
import { Container, Table, Row, Col, Card, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import api from "../api/api";

export default function VacationHistoryPage() {
  const [user, setUser] = useState(null);
  const [vacations, setVacations] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const TOTAL_VACATION_DAYS = 15; 

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/vacation/history")) {
      const sidebarEvent = new CustomEvent("updateActiveMenu", {
        detail: {
          activeMenu: "vacation",
          activeSub: "휴가내역",
        },
      });
      window.dispatchEvent(sidebarEvent); 
    }
  }, [location]);

  // 승인된 휴가
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
      } catch (err) {
        console.error("휴가 데이터 불러오기 실패:", err);
      }
    };
    fetchData();
  }, []);

  // 월별 통계 계산
  useEffect(() => {
    if (vacations.length === 0) return;

    const grouped = {};
    const today = new Date();
    const year = today.getFullYear();

    // 1~12월 초기화
    for (let i = 0; i < 12; i++) {
      const key = `${year}-${String(i + 1).padStart(2, "0")}`;
      grouped[key] = {
        month: key,
        used: 0,
        gained: 0,
      };
    }

    // 사용 연차 계산
    vacations.forEach((v) => {
      const start = new Date(v.startDate);
      const end = new Date(v.endDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      const usedDays = v.vacationType === "반차" ? 0.5 : diff;
      const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;
      if (grouped[key]) grouped[key].used += usedDays;
    });

    // 발생 연차 및 월별 데이터 구성
    let accumulated = 0;
    const monthlyArr = Object.values(grouped).map((m) => {
      accumulated += TOTAL_VACATION_DAYS / 12; // 월별 발생량
      const remain = TOTAL_VACATION_DAYS - m.used;
      return {
        month: m.month,
        gained: (TOTAL_VACATION_DAYS / 12).toFixed(1),
        used: m.used.toFixed(1),
        total: TOTAL_VACATION_DAYS.toFixed(1),
        remain: Math.max(remain, 0).toFixed(1),
      };
    });

    setMonthlyData(monthlyArr);
  }, [vacations]);

  // 엑셀 다운로드
  const exportToCSV = () => {
    const header = ["연월,전연차,사용연차,총연차,발생연차"];
    const rows = monthlyData.map(
      (m) => `${m.month},${m.remain}d,${m.used}d,${m.total}d,${m.gained}d`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "연차내역.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container className="py-4">
      <h3 className="fw-bold mb-4">📘 연차내역</h3>

      {/* 연차 현황 박스 */}
      <Card className="shadow-sm border-0 rounded-4 p-3 mb-4">
        <Row className="text-center">
          <Col>
            <div className="text-muted small">전연 연차</div>
            <h5 className="fw-bold text-primary">
              {monthlyData.length > 0 ? monthlyData[0].remain : "0"}d
            </h5>
          </Col>
          <Col>
            <div className="text-muted small">사용 연차</div>
            <h5 className="fw-bold text-danger">
              {monthlyData.reduce((a, b) => a + Number(b.used), 0).toFixed(1)}d
            </h5>
          </Col>
          <Col>
            <div className="text-muted small">총 연차</div>
            <h5 className="fw-bold text-dark">{TOTAL_VACATION_DAYS}d</h5>
          </Col>
          <Col>
            <div className="text-muted small">발생 연차</div>
            <h5 className="fw-bold text-success">
              {(TOTAL_VACATION_DAYS / 12).toFixed(1)}d /월
            </h5>
          </Col>
        </Row>
      </Card>

      {/* 연차 내역 테이블 */}
      <Card className="shadow-sm border-0 rounded-4 p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="fw-semibold mb-0">연차내역</h5>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={exportToCSV}
            title="엑셀 다운로드"
          >
            📥 엑셀 다운로드
          </Button>
        </div>

        <Table hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>연월</th>
              <th>잔여연차</th>
              <th>사용연차</th>
              <th>총연차</th>
              <th>발생연차</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-muted py-3">
                  연차 내역이 없습니다.
                </td>
              </tr>
            ) : (
              monthlyData.map((m) => (
                <tr key={m.month}>
                  <td>{m.month}</td>
                  <td className="fw-semibold text-primary">{m.remain}d</td>
                  <td className="text-danger">{m.used}d</td>
                  <td>{m.total}d</td>
                  <td className="text-success">{m.gained}d</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}
