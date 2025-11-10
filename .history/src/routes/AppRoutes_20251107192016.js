import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/member/LoginPage";

import ApprovalPage from "../pages/ApprovalPage";
import AttendanceTracker from "../pages/AttendanceTracker";
import LeaveStatus from "../pages/LeaveStatus";

// {/* 전자결재 */}
import ApprovalRequestPage from "../pages/ApprovalRequestPage";
import ApprovalTempPage from "../pages/ApprovalTempPage";
import ApprovalDetail from '../pages/ApprovalDetail'; //경로는 실제 위치에 맞게 조정.

// import BoardPage from "../pages/BoardPage";
import BoardWrite from "../pages/board/BoardWrite";
import BoardNoticePage from "../pages/board/BoardNoticePage";
import BoardFreePage from "../pages/board/BoardFreePage";
import BoardDetail from "../pages/board/BoardDetail";
import BoardEdit from "../pages/board/BoardEdit";
import SamplePage from "../sample/SamplePage"
import PositionPage from "../pages/member/PositionPage";
import PrivateLayoutRoute from "./PrivateLayoutRoute";
import AuthRedirectRoute from "./AuthRedirectRoute";

// 회원관리
import SchedulePage from "../pages/member/SchedulePage";
import SignupPage from "../pages/member/SignupPage";
import PositionListPage from "../pages/member/PositionListPage";
import PositionDetailPage from "../pages/member/PositionDetailPage";
import PositionHistoryList from "../pages/member/PositionHistoryList";
import PositionHistoryForm from "../pages/member/PositionHistoryForm";
import PositionHistoryPage from "../pages/member/PositionHistoryPage";
import CategoryPage from '../pages/member/CategoryPage';

import MySalaryHistory from '../pages/MySalaryHistory';
import CompletedSalaries from '../pages/CompletedSalaries';
import SalaryForm from '../pages/SalaryForm';
import SalaryDetailPage from '../pages/SalaryDetailCard';


import TestPage from '../sample/TestPage';

import SalarySettingPage from '../pages/SalarySettingPage';

// {/* 휴가 */}
import VacationPage from '../pages/VacationPage';
import VacationHistoryPage from '../pages/VacationHistoryPage';

// 이 파일은 라우팅 정보를 담고 있는 파일입니다.
// 이러한 파일을 네트워크에서는 routing table이라고 합니다.
function AppRoutes() {

    const navigate = useNavigate();

    function NotFound() {
        useEffect(() => {
            sessionStorage.removeItem("storedCategory");

            // 다시 저장
            sessionStorage.setItem("storedCategory", JSON.stringify({ id: 'home', no: 1 }));
            alert("존재하지 않는 페이지입니다. 홈으로 이동합니다.");
            navigate("/home", { replace: true });
        }, []);

        return null;
    }

    return (
        <Routes>
            {/* Layout 없이 전체 화면 */}

            {/* 로그인/회원가입페이지 */}
            <Route element={<AuthRedirectRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/test" element={<TestPage />} />
            </Route>

            <Route path="*" element={<NotFound />} /> {/* 모든 미정의 경로 처리 */}

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
                <Route path="/member/category" element={<CategoryPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/attendance/attendance" element={<AttendanceTracker />} />
                <Route path="/attendance/leave" element={<LeaveStatus />} />




                {/* 급여 관련 페이지 */}
                <Route path="/salary/salary" element={<Navigate to="/salary/my-salaries" />} />
                {/* 나의 급여 내역 */}
                <Route path="/salary/my-salaries" element={<MySalaryHistory />} />
                {/* 전체 급여 목록 (관리자) */}
                <Route path="/salary/salaries/completed" element={<CompletedSalaries />} />
                {/* 급여 생성 */}
                <Route path="/salary/salaries/new" element={<SalaryForm />} />
                {/* 급여 상세 조회 */}
                <Route path="/salary/salaries/:salaryId" element={<SalaryDetailPage />} />

                {/* 기본급 설정 */}
                <Route path="/salary/salary-settings" element={<SalarySettingPage />} />


                {/* 전자결재 */}
                <Route path="/approval" element={<Navigate to="/approval/status" />} />
                <Route path="/approval/request" element={<ApprovalRequestPage />} />
                <Route path="/approval/status" element={<ApprovalPage />} />
                <Route path="/approval/temp" element={<ApprovalTempPage />} />
                <Route path="/test-approval" element={<ApprovalDetail />} />
                <Route path="/approval/detail/:id" element={<ApprovalDetail />} />
                <Route path="/approval" element={<ApprovalPage />} />

                {/* 게시판 */}
                {/* <Route path="/board" element={<BoardPage />} /> */}
                <Route path="/board/write" element={<BoardWrite />} />
                <Route path="/board/notice" element={<BoardNoticePage />} />
                <Route path="/board/free" element={<BoardFreePage />} />
                <Route path="/board/detail/:id" element={<BoardDetail />} />
                <Route path="/board/edit/:id" element={<BoardEdit />} />

                {/* 휴가 */}
                <Route path="/vacation/list" element={<VacationPage />} />
                <Route path="/vacation/history" element={<VacationHistoryPage />} />
                {/* 다른 페이지 추가 */}

            </Route>
        </Routes>
    );
}

export default AppRoutes;