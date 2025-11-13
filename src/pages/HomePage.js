import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Badge,
  Table,
  ProgressBar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaFileSignature,
  FaClipboardList,
  FaCalendarCheck,
  FaUmbrellaBeach,
} from "react-icons/fa";
import api from "../api/api";
import MemberDashBoardPage from "./member/MemberDashBoardPage";
import BoardDashBoardPage from "./board/BoardDashBoardPage";
import ScheduleDashBoardPage from "./schedule/ScheduleDashBoardPage";

export default function Homepage() {
  const navigate = useNavigate();
  const [approvalSummary, setApprovalSummary] = useState({ 
    waiting: 0,
    recent: [],
    });
  const [vacationInfo, setVacationInfo] = useState({
    used: 0,
    total: 15,
    remain: 15,
    percent: 0,
    recent: [],
  });

  // 결재 데이터
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await api.get("/api/requests/approvals");
        const waitingCount = res.data.requests?.length || 0;
        const recentDocs = res.data.requests
          ?.slice(0, 2)
          .map((r) => ({
            id: r.id,
            title: `${r.requestType} - ${r.memberName}`,
            date: new Date(r.dateTime).toLocaleDateString(),
          })) || [];
        setApprovalSummary({ waiting: waitingCount, recent: recentDocs });
      } catch (err) {
        console.error("결재 현황 불러오기 실패:", err);
      }
    };
    fetchApprovals();
  }, []);

   // 휴가 데이터
  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const userRes = await api.get("/user/me");
        const reqRes = await api.get("/api/requests");
        const approved = reqRes.data.filter(
          (r) =>
            r.requestType === "휴가" &&
            r.status === "승인" &&
            r.memberId === userRes.data.memberId
        );

        const TOTAL = 15;
        const used = approved.reduce((sum, v) => {
          const start = new Date(v.startDate);
          const end = new Date(v.endDate);
          const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          const count = v.vacationType === "반차" ? 0.5 : diff;
          return sum + count;
        }, 0);
        const percent = Math.min(Math.round((used / TOTAL) * 100), 100);
        const sorted = [...approved].sort(
          (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );
        const recent = sorted.slice(0, 2).map((v) => ({
          type: v.vacationType,
          start: new Date(v.startDate).toLocaleDateString(),
          end: new Date(v.endDate).toLocaleDateString(),
          days:
            v.vacationType === "반차"
              ? "0.5일"
              : `${Math.ceil(
                  (new Date(v.endDate) - new Date(v.startDate)) /
                    (1000 * 60 * 60 * 24)
                ) + 1}일`,
        }));

        setVacationInfo({
          used,
          total: TOTAL,
          remain: TOTAL - used,
          percent,
          recent,
        });
      } catch (err) {
        console.error("휴가 데이터 불러오기 실패:", err);
      }
    };
    fetchVacations();
  }, []);

  return (
    <Container
      fluid
      className="py-4"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <h3 className="mb-4">🏠 메인 대시보드</h3>

      <style>{`
        /* 한 줄(행) 전체 그리드 */
        .dashboard-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;                 /* 카드 간 가로/세로 간격 */
          width: 100%;
          align-items: stretch;      /* 같은 줄 카드 높이 자동 동일화 */
          margin-bottom: 24px;       /* 행 간 세로 간격 */
          justify-content: center;
        }

        /* 카드 외곽 wrapper: 열(column) 역할 */
        .dashboard-card-wrapper {
          flex: 1 1 calc(33.333% - 24px);
          max-width: calc(33.333% - 24px);
          display: flex;             /* 내부 카드가 wrapper 전체 채우게 */
        }

        /* 실제 카드 공통 스타일 */
        .dashboard-card {
          flex: 1;                   /* wrapper 안에서 높이 100% 채움 */
          background: white;
          border: none;
          border-radius: 16px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.08);
          position: relative;
          transition: 0.2s;
          display: flex;
          flex-direction: column;
        }

        .dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        /* 🔔 알림 배지 */
        .badge-noti {
          position: absolute;
          top: 16px;
          right: 20px;
          font-size: 0.75rem;
          padding: 6px 8px;
          border-radius: 50%;
        }

        /* 2행: 공지 + 휴가 (2열) */
        .dashboard-grid:nth-of-type(2) .dashboard-card-wrapper {
          flex: 1 1 calc(50% - 24px);
          max-width: calc(50% - 24px);
        }

        /* 3행: 캘린더 (1열 전체) */
        .dashboard-grid:nth-of-type(3) .dashboard-card-wrapper {
          flex: 1 1 100%;
          max-width: 100%;
        }

        /* 반응형 */
        @media (max-width: 992px) {
          .dashboard-card-wrapper {
            flex: 1 1 calc(50% - 24px);
            max-width: calc(50% - 24px);
          }
        }

        @media (max-width: 576px) {
          .dashboard-card-wrapper {
            flex: 1 1 100%;
            max-width: 100%;
          }
        }

        /* 캘린더 카드 폭 조정 */
        .dashboard-grid:nth-of-type(3) .dashboard-card-wrapper {
        max-width: 900px;     /* 원하는 폭으로 줄이기 */
        flex: 1 1 900px;       /* 강제로 이 폭으로 맞추기 */
       }

       .dashboard-grid.calendar-row {
       max-width: calc(100% - 24px) !important;
       margin-left: 12px !important;
       margin-right: 12px !important;
       }

      `}</style>

      {/* 1행: 프로필 / 전자결재 / 근태 */}
      <div className="dashboard-grid">
        {/* 1행 1열: 프로필 */}
        <div className="dashboard-card-wrapper">
          <Card className="dashboard-card">
            <MemberDashBoardPage />
          </Card>
        </div>

        {/* 1행 2열: 전자결재 */}
        <div className="dashboard-card-wrapper">
          <Card className="dashboard-card text-center">
            {approvalSummary.waiting > 0 && (
              <Badge bg="danger" className="badge-noti">
                {approvalSummary.waiting}
              </Badge>
            )}
            <Card.Body className="w-100 px-4 d-flex flex-column justify-content-between">
              <div>
                <FaFileSignature size={40} className="text-primary mb-2" />
                <h5>전자결재</h5>
                <p className="text-muted small mb-2">
                  최근 결재 요청 문서 2건이 표시됩니다.
                </p>
                <Table hover size="sm" className="mb-2">
                  <thead className="table-light">
                    <tr>
                      <th>문서명</th>
                      <th>작성일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalSummary.recent.length === 0 ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="text-muted small text-center"
                        >
                          결재 대기 문서 없음
                        </td>
                      </tr>
                    ) : (
                      approvalSummary.recent.map((r) => (
                        <tr key={r.id}>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "100px" }}
                          >
                            {r.title}
                          </td>
                          <td>{r.date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => navigate("/approval/status")}
              >
               바로가기
              </Button>
            </Card.Body>
          </Card>
        </div>

        {/* 1행 3열: 근태 관리 */}
        <div className="dashboard-card-wrapper">
          <Card className="dashboard-card text-center">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <FaCalendarCheck size={50} className="text-success mb-3" />
              <h5>근태 관리</h5>
              <p className="text-muted small mb-2">
                출근 / 퇴근 기록 및 주간 통계
              </p>
              <Button variant="outline-success" size="sm" disabled>
                준비 중
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* 2행: 공지사항 / 휴가 관리 */}
      <div className="dashboard-grid mt-4">
        {/* 2행 1열: 공지사항 */}
        <div className="dashboard-card-wrapper">
          <Card className="dashboard-card text-center">
            <Card.Body className="w-100 h-100 d-flex flex-column">
              <BoardDashBoardPage />
            </Card.Body>
          </Card>
        </div>

        {/* 2행 2열: 휴가 관리 */}
        <div className="dashboard-card-wrapper">
          <Card className="dashboard-card text-center p-3">
            <Card.Body className="w-100 px-2 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <FaUmbrellaBeach size={38} className="text-danger me-2" />
                  <h5 className="mb-0">휴가 관리</h5>
                </div>

                <ProgressBar
                  now={vacationInfo.percent}
                  variant={
                    vacationInfo.percent >= 90
                      ? "danger"
                      : vacationInfo.percent >= 60
                      ? "warning"
                      : "success"
                  }
                  label={`${vacationInfo.percent}%`}
                  style={{ height: "14px" }}
                />
                <div className="d-flex justify-content-between mt-1 text-muted small">
                  <span>사용 {vacationInfo.used.toFixed(1)}일</span>
                  <span>잔여 {vacationInfo.remain.toFixed(1)}일</span>
                </div>

                <Table hover size="sm" className="mt-2 mb-2">
                  <thead className="table-light">
                    <tr>
                      <th>종류</th>
                      <th>기간</th>
                      <th>일수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vacationInfo.recent.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-muted small text-center"
                        >
                          승인된 휴가 없음
                        </td>
                      </tr>
                    ) : (
                      vacationInfo.recent.map((v, idx) => (
                        <tr key={idx}>
                          <td>{v.type}</td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "120px" }}
                          >
                            {v.start}~{v.end}
                          </td>
                          <td>{v.days}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => {
                  sessionStorage.setItem(
                    "storedCategory",
                    JSON.stringify({ id: "vacation", no: 0 })
                  );
                  navigate("/vacation/list");
                }}
              >
                바로가기
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* 3행: 캘린더 */}
      <div className="dashboard-grid calendar-row mt-4">
        <div className="dashboard-card-wrapper">
          <Card className="dashboard-card">
            <Card.Body className="w-100 h-100 d-flex flex-column">
              <ScheduleDashBoardPage />
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}