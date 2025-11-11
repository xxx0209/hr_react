import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaFileSignature,
  FaClipboardList,
  FaCalendarCheck,
} from "react-icons/fa";
import api from "../api/api";
import MemberDashBoardPage from "./member/MemberDashBoardPage";
import ScheduleDashBoardPage from "./member/ScheduleDashBoardPage";

export default function Homepage() {
  const navigate = useNavigate();
  const [approvalSummary, setApprovalSummary] = useState({ waiting: 0 });

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await api.get("/api/requests/approvals");
        const waitingCount = res.data.requests?.length || 0;
        setApprovalSummary({ waiting: waitingCount });
      } catch (err) {
        console.error("결재 현황 불러오기 실패:", err);
      }
    };
    fetchApprovals();
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
  /* 공통 카드 그리드 */
  .dashboard-grid {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
    width: 100%;
  }

  /* 카드 공통 디자인 */
  .dashboard-card {
    flex: 1 1 calc(33.333% - 24px); /* 1행 기본 3개 균등 분배 */
    max-width: calc(33.333% - 24px);
    height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: white;
    border: none;
    border-radius: 16px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.08);
    position: relative;
    transition: 0.2s;
  }

  /* hover 효과 */
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

  /* === 2행, 3행의 카드 폭 자동 확장 규칙 === */
  .dashboard-grid:nth-of-type(2) .dashboard-card {
    flex: 1 1 calc(50% - 24px);
    max-width: calc(50% - 24px);
  }

  .dashboard-grid:nth-of-type(3) .dashboard-card {
    flex: 1 1 100%;
    max-width: calc(100% - 24px);
  }

  /* 반응형 대응 (태블릿 이하) */
  @media (max-width: 992px) {
    .dashboard-card {
      flex: 1 1 calc(50% - 24px);
      max-width: calc(50% - 24px);
    }
  }

  @media (max-width: 576px) {
    .dashboard-card {
      flex: 1 1 100%;
      max-width: 100%;
    }
  }
`}</style>


      <div className="dashboard-grid">
        {/* 1행 1열: 프로필 */}
        <ScheduleDashBoardPage />
        <Card className="dashboard-card text-center">
          <Card.Body className="d-flex flex-column align-items-center justify-content-center">
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

        {/* 1행 2열: 전자결재 */}
        <Card
          className="dashboard-card text-center"
          onClick={() => navigate("/approval")}
          style={{ cursor: "pointer" }}
        >
          {approvalSummary.waiting > 0 && (
            <Badge bg="danger" className="badge-noti">
              {approvalSummary.waiting}
            </Badge>
          )}
          <Card.Body className="d-flex flex-column align-items-center justify-content-center">
            <FaFileSignature size={50} className="text-primary mb-3" />
            <h5>전자결재</h5>
            <p className="text-muted small mb-2">결재 요청 / 승인 / 현황 확인</p>
            <Button variant="outline-primary" size="sm">
              바로가기
            </Button>
          </Card.Body>
        </Card>

        {/* 1행 3열: 근태 관리 */}
        <Card className="dashboard-card text-center">
          <Card.Body className="d-flex flex-column align-items-center justify-content-center">
            <FaCalendarCheck size={50} className="text-success mb-3" />
            <h5>근태 관리</h5>
            <p className="text-muted small mb-2">출근 / 퇴근 기록 및 주간 통계</p>
            <Button variant="outline-success" size="sm" disabled>
              준비 중
            </Button>
          </Card.Body>
        </Card>
      </div>

      <div className="dashboard-grid mt-4">
        {/* 2행 1열: 공지사항 */}
        <Card className="dashboard-card text-center">
          <Card.Body className="d-flex flex-column align-items-center justify-content-center">
            <FaClipboardList size={50} className="text-warning mb-3" />
            <h5>공지사항</h5>
            <p className="text-muted small mb-2">공지사항 / 자유게시판 확인</p>
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => navigate("/board")}
            >
              바로가기
            </Button>
          </Card.Body>
        </Card>

        {/* 2행 2열: 캘린더 */}
        {/* 2행 3열: 휴가 관리 */}
        <Card className="dashboard-card text-center">
          <Card.Body className="d-flex flex-column align-items-center justify-content-center">
            <FaFileSignature size={50} className="text-danger mb-3" />
            <h5>휴가 관리</h5>
            <p className="text-muted small mb-2">연차 / 반차 / 휴가 신청 및 확인</p>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => navigate("/vacation")}
            >
              바로가기
            </Button>
          </Card.Body>
        </Card>
      </div>

      <div className="dashboard-grid mt-4">
        {/* 2행 2열: 캘린더 */}
        <ScheduleDashBoardPage />
      </div>
    </Container>
  );
}
