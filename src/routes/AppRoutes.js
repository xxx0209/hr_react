import React, { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

// 기본 페이지
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/member/LoginPage";

// 전자결재
import ApprovalPage from "../pages/ApprovalPage";
import ApprovalRequestPage from "../pages/ApprovalRequestPage";
import ApprovalTempPage from "../pages/ApprovalTempPage";
import ApprovalDetail from "../pages/ApprovalDetail";

// 근태 및 휴가
import AttendanceDashboard from "../pages/attendance/AttendanceDashboard";
import AttendanceTracker from "../pages/attendance/AttendanceTracker"; //출퇴근 기록
import AttendancePage from "../pages/attendance/AttendancePage"; //출퇴근 기능
import LeaveStatus from "../pages/attendance/LeaveStatus"; //휴가 현황
import VacationPage from "../pages/VacationPage";
import VacationHistoryPage from "../pages/VacationHistoryPage";

// 게시판
import BoardWrite from "../pages/board/BoardWrite";
import BoardNoticePage from "../pages/board/BoardNoticePage";
import BoardFreePage from "../pages/board/BoardFreePage";
import BoardDetail from "../pages/board/BoardDetail";
import BoardEdit from "../pages/board/BoardEdit";

// 회원관리
import SchedulePage from "../pages/member/SchedulePage";
import SignupPage from "../pages/member/SignupPage";
import PositionPage from "../pages/member/PositionPage";
import PositionListPage from "../pages/member/PositionListPage";
import PositionDetailPage from "../pages/member/PositionDetailPage";
// import PositionHistoryPage from "../pages/member/PositionHistoryPage";
import PositionHistoryList from "../pages/member/PositionHistoryList";
import PositionHistoryForm from "../pages/member/PositionHistoryForm";
import CategoryPage from '../pages/member/CategoryPage';
import MemberEditPage from '../pages/member/MemberEditPage';

import MySalaryHistory from '../pages/salary/MySalaryHistory';
import CompletedSalaries from '../pages/salary/CompletedSalaries';
import SalaryForm from '../pages/salary/SalaryForm';
import SalaryDetailPage from '../pages/salary/SalaryDetailCard';
import SalarySettingPage from '../pages/salary/SalarySettingPage';

// 샘플 페이지
import SamplePage from "../sample/SamplePage";
import TestPage from "../sample/TestPage";

// 라우트 보호
import PrivateLayoutRoute from "./PrivateLayoutRoute";
import AuthRedirectRoute from "./AuthRedirectRoute";

// 이 파일은 라우팅 정보를 담고 있는 파일입니다.
// 이러한 파일을 네트워크에서는 routing table이라고 합니다.
function AppRoutes() {
    const navigate = useNavigate();

    function NotFound() {
        useEffect(() => {
            //sessionStorage.removeItem("storedCategory");
            //sessionStorage.setItem("storedCategory", JSON.stringify({ id: "home", no: 1 }));
            alert("존재하지 않는 페이지입니다. 홈으로 이동합니다.");
            navigate("/home", { replace: true });
        }, [navigate]);

        return null;
    }

    return (
        <Routes>
            {/* 로그인/회원가입페이지 */}
            <Route element={<AuthRedirectRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/test" element={<TestPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />

            {/* 공통 Layout + PrivateRoute 그룹 */}
            <Route element={<PrivateLayoutRoute />}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />

                {/* 회원 관련 */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/member/samplePage" element={<SamplePage />} />
                <Route path="/member/position" element={<PositionPage />} />
                <Route path="/member/position/list" element={<PositionListPage />} />
                <Route path="/member/position/:id" element={<PositionDetailPage />} />
                {/* <Route path="/member/position/history/page" element={<PositionHistoryPage />} /> */}
                <Route path="/member/position/history/list" element={<PositionHistoryList />} />
                <Route path="/member/position/history/:id" element={<PositionHistoryForm />} />
                <Route path="/member/position/history/save" element={<PositionHistoryForm />} />
                <Route path="/member/schedule" element={<SchedulePage />} />
                <Route path="/member/category" element={<CategoryPage />} />
                <Route path="/member/update" element={<MemberEditPage />} />

                {/* 급여 관련 */}
                <Route path="/salary/salary" element={<Navigate to="/salary/my-salaries" />} />
                <Route path="/salary/my-salaries" element={<MySalaryHistory />} />
                <Route path="/salary/salaries/completed" element={<CompletedSalaries />} />
                <Route path="/salary/salaries/new" element={<SalaryForm />} />
                <Route path="/salary/salaries/:salaryId" element={<SalaryDetailPage />} />
                <Route path="/salary/salary-settings" element={<SalarySettingPage />} />

                {/* 전자결재 */}
                <Route path="/approval" element={<Navigate to="/approval/status" />} />
                <Route path="/approval/request" element={<ApprovalRequestPage />} />
                <Route path="/approval/status" element={<ApprovalPage />} />
                <Route path="/approval/temp" element={<ApprovalTempPage />} />
                <Route path="/approval/detail/:id" element={<ApprovalDetail />} />
                <Route path="/test-approval" element={<ApprovalDetail />} />

                {/* 게시판 */}
                {/* <Route path="/board" element={<BoardPage />} /> */}
                <Route path="/board/write" element={<BoardWrite />} />
                <Route path="/board/notice" element={<BoardNoticePage />} />
                <Route path="/board/free" element={<BoardFreePage />} />
                <Route path="/board/detail/:id" element={<BoardDetail />} />
                <Route path="/board/edit/:id" element={<BoardEdit />} />

                {/* 근태 관련 */}
                <Route path="/attendance/dashboard" element={<AttendanceDashboard />} />
                <Route path="/attendance/tracker" element={<AttendanceTracker />} />
                <Route path="/attendance/leave" element={<LeaveStatus />} />
                <Route path="/attendance" element={<AttendancePage />} />

                {/* 근태/휴가 */}
                <Route path="/vacation/list" element={<VacationPage />} />
                <Route path="/vacation/history" element={<VacationHistoryPage />} />


                {/* 다른 페이지 추가 */}

            </Route>
        </Routes>
    );

}

export default AppRoutes;
