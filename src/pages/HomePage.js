/*
React + React-Bootstrap 기본 컴포넌트 템플릿
사용법:
1) 의존성 설치:
   npm install react-bootstrap bootstrap react-icons axios react-router-dom
2) index.js 또는 App 진입점에 Bootstrap CSS 추가:
   import 'bootstrap/dist/css/bootstrap.min.css';
3) 이 파일을 프로젝트에 추가하고 App에서 import HomepagePage from './HomepagePage'; 사용

설명:
- 전자결재 카드 포함한 기본 대시보드 예시입니다.
- 결재요청 미리보기 / 결재 대기 문서 수 표시 기능 포함.
- 근무 관련 기능은 아래 주석된 영역 참고하여 추후 확장 가능합니다.
*/

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaFileSignature, FaClipboardList, FaCalendarCheck } from "react-icons/fa";
import api from "../api/api";

export default function Homepage() {
  const navigate = useNavigate();
  const [approvalSummary, setApprovalSummary] = useState({ waiting: 0, recent: [] });

  // 결재 현황 요약 데이터 (최근 요청 + 대기 문서 수)
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await api.get("/api/requests/approvals");
        const waitingCount = res.data.requests?.length || 0;
        const recentList = res.data.requests?.slice(0, 3) || [];
        setApprovalSummary({ waiting: waitingCount, recent: recentList });
      } catch (err) {
        console.error("결재 현황 불러오기 실패:", err);
      }
    };
    fetchApprovals();
  }, []);

  // ===========================================
  // 근무 관련 로직 (추후 확장 가능)
  // ===========================================
  // const [clockInTime, setClockInTime] = useState(null); // 예: "08:43"
  // const [clockOutTime, setClockOutTime] = useState(null); // 예: "18:02"
  // const [workStatus, setWorkStatus] = useState("정상");
  // const [weeklyStats, setWeeklyStats] = useState({
  //   totalHours: "0h 0m",
  //   lateCount: 0,
  //   earlyLeaveCount: 0,
  //   absentCount: 0,
  // });
  // const handleClockIn = () => {
  //   const now = new Date().toLocaleTimeString("ko-KR", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  //   setClockInTime(now);
  //   // TODO: API 호출로 출근 시간 저장
  // };
  // const handleClockOut = () => {
  //   const now = new Date().toLocaleTimeString("ko-KR", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  //   setClockOutTime(now);
  //   // TODO: API 호출로 퇴근 시간 저장
  // };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <h3 className="mb-4">🏠 메인 대시보드</h3>

      <Row className="g-4">
        {/* 왼쪽: 프로필 카드 */}
        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
                alt="프로필"
                className="rounded-circle mb-3"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <h5>관리자</h5>
              <p className="text-muted small mb-1">개발팀 / 과장</p>
            </Card.Body>
          </Card>
        </Col>

        {/* 오른쪽: 기능 카드들 */}
        <Col md={9}>
          <Row className="g-4">
            {/* 전자결재 카드 */}
            <Col md={6} lg={4}>
              <Card
                className="shadow-sm border-0 rounded-4 hover-card"
                onClick={() => navigate("/approval")}
                style={{ cursor: "pointer", transition: "0.2s" }}
              >
                <Card.Body className="text-center">
                  <FaFileSignature size={40} className="text-primary mb-3" />
                  <h5 className="mb-2">
                    전자결재{" "}
                    {approvalSummary.waiting > 0 && (
                      <Badge bg="danger" pill className="ms-2">
                        {approvalSummary.waiting}
                      </Badge>
                    )}
                  </h5>
                  <p className="text-muted small mb-3">결재 요청 / 승인 / 현황 확인</p>

                  {/* 최근 결재 문서 3건 미리보기 */}
                  {approvalSummary.recent.length > 0 ? (
                    <Table size="sm" bordered hover className="text-start small">
                      <thead className="table-light">
                        <tr>
                          <th>종류</th>
                          <th>작성자</th>
                          <th>상태</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvalSummary.recent.map((r) => (
                          <tr key={r.id}>
                            <td>{r.requestType}</td>
                            <td>{r.memberName}</td>
                            <td>
                              <Badge bg="warning">{r.status}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted small mb-2">최근 결재 요청이 없습니다.</p>
                  )}

                  <Button variant="outline-primary" size="sm" className="mt-2">
                    바로가기
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* 근태 관리 카드 */}
            <Col md={6} lg={4}>
              <Card className="shadow-sm border-0 rounded-4 text-center">
                <Card.Body>
                  <FaCalendarCheck size={40} className="text-success mb-3" />
                  <h5>근태 관리</h5>
                  <p className="text-muted small">출근 / 퇴근 기록 및 주간 통계</p>
                  <Button variant="outline-success" size="sm" disabled>
                    준비 중
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* 보고서 카드 */}
            <Col md={6} lg={4}>
              <Card className="shadow-sm border-0 rounded-4 text-center">
                <Card.Body>
                  <FaClipboardList size={40} className="text-info mb-3" />
                  <h5>보고서</h5>
                  <p className="text-muted small">업무 일지 및 주간 보고 관리</p>
                  <Button variant="outline-info" size="sm" disabled>
                    준비 중
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 카드 hover 효과 */}
      <style>{`
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }
      `}</style>
    </Container>
  );
}
