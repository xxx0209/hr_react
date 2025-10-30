import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SchedulePage from "../pages/SchedulePage";
import SignupPage from "../pages/SignupPage";
import ApprovalPage from "../pages/ApprovalPage";
import AttendanceTracker from "../pages/AttendanceTracker";
import LeaveStatus from "../pages/LeaveStatus";

import ApprovalRequestPage from "../pages/ApprovalRequestPage";
import ApprovalTempPage from "../pages/ApprovalTempPage";
import ApprovalDetail from '../pages/ApprovalDetail'; //경로는 실제 위치에 맞게 조정.
import BoardPage from "../pages/BoardPage";
import SamplePage from "../sample/SamplePage"
import PositionPage from "../pages/PositionPage";
import PrivateLayoutRoute from "./PrivateLayoutRoute";
import AuthRedirectRoute from "./AuthRedirectRoute";
import PositionListPage from "../pages/PositionListPage";
import PositionDetailPage from "../pages/PositionDetailPage";
import PositionHistoryList from "../pages/PositionHistoryList";
import PositionHistoryForm from "../pages/PositionHistoryForm";
import PositionHistoryPage from "../pages/PositionHistoryPage";

import MySalaryHistory from '../pages/MySalaryHistory';
import SalaryListPage from '../pages/SalaryListPage';
import SalaryForm from '../pages/SalaryForm';
import SalaryDetailPage from '../pages/SalaryDetailCard';
import SalaryEditPage from '../pages/SalaryEditpage';
import PendingSalaryList from '../pages/PendingSalaryList';
import BaseSalaryPage from '../pages/BaseSalaryPage';



// 이 파일은 라우팅 정보를 담고 있는 파일입니다.
// 이러한 파일을 네트워크에서는 routing table이라고 합니다.
function AppRoutes() {

    return (
        <Routes>
            {/* Layout 없이 전체 화면 */}

            {/* 로그인/회원가입페이지 */}
            <Route element={<AuthRedirectRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* 공통 Layout + PrivateRoute 그룹 */}
            <Route element={<PrivateLayoutRoute />}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/member/samplePage" element={<SamplePage />} />
                <Route path="/member/position" element={<PositionPage />} />
                <Route path="/member/position/list" element={<PositionListPage />} />
                <Route path="/member/position/:id" element={<PositionDetailPage />} />
                <Route path="/member/position/history/page" element={<PositionHistoryPage />} />
                <Route path="/member/position/history/list" element={<PositionHistoryList />} />
                <Route path="/member/position/history/:id" element={<PositionHistoryForm />} />
                <Route path="/member/position/history/save" element={<PositionHistoryForm />} />
                <Route path="/member/schedule" element={<SchedulePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/attendance" element={<AttendanceTracker />} />
                <Route path="/leave" element={<LeaveStatus />} />




                {/* 급여 관련 페이지 */}
                <Route path="/salary/salary" element={<Navigate to="/salary/my-salaries" />} />
                {/* 나의 급여 내역 */}
                <Route path="/salary/my-salaries" element={<MySalaryHistory />} />
                {/* 전체 급여 목록 (관리자) */}
                <Route path="/salary/salaries" element={<SalaryListPage />} />
                {/* 급여 생성 */}
                <Route path="/salary/salaries/new" element={<SalaryForm />} />
                {/* 급여 상세 조회 */}
                <Route path="/salary/salaries/:salaryId" element={<SalaryDetailPage />} />
                {/* 급여 수정 (관리자) */}
                <Route path="/salary/salaries/:salaryId/edit" element={<SalaryEditPage />} />
                {/* 승인 대기 급여 목록 */}
                <Route path="/salary/salaries/pending" element={<PendingSalaryList />} />
                {/* 기본급 설정 */}
                <Route path="/salary/base-salary" element={<BaseSalaryPage />} />


                {/* 전자결재 페이지 */}
                <Route path="/approval" element={<Navigate to="/approval/status" />} />
                <Route path="/approval/request" element={<ApprovalRequestPage />} />
                <Route path="/approval/status" element={<ApprovalPage />} />
                <Route path="/approval/temp" element={<ApprovalTempPage />} />
                <Route path="/test-approval" element={<ApprovalDetail />} />
                <Route path="/approval/detail/:id" element={<ApprovalDetail />} />
                <Route path="/approval" element={<ApprovalPage />} />

                {/* 게시판 */}
                <Route path="/board" element={<BoardPage />} />
                {/* 다른 페이지 추가 */}

            </Route>
        </Routes>
    );
}

export default AppRoutes;