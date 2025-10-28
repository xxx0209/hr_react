import React from 'react';
import { BrowserRouter as Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ScheduleCalendarWithForm from "../pages/SchedulePage";
import SignupPage from "../pages/SignupPage";
import ApprovalPage from "../pages/ApprovalPage";
import AttendanceTracker from "../pages/AttendanceTracker";
import LeaveStatus from "../pages/LeaveStatus";
import Layout from '../pages/Layout';

import ApprovalRequestPage from "../pages/ApprovalRequestPage";
import ApprovalTempPage from "../pages/ApprovalTempPage";
import ApprovalDetail from '../pages/ApprovalDetail'; //경로는 실제 위치에 맞게 조정.

// 이 파일은 라우팅 정보를 담고 있는 파일입니다.
// 이러한 파일을 네트워크에서는 routing table이라고 합니다.
function AppRoutes() {
    // user : 사용자 정보를 저장하고 있는 객체
    // handleLoginSuccess : 로그인 성공시 동작할 액션
    return (
        <Routes>
            <Route element={<Layout />}>
                {/* path 프롭스는 요청 정보 url, element 프롭스는 컴포넌트 이름 */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/schedule" element={<ScheduleCalendarWithForm />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/attendance" element={<AttendanceTracker />} />
                <Route path="/leave" element={<LeaveStatus />} />

                {/* 전자결재 페이지 */}

                <Route path="/approval" element={<Navigate to="/approval/status" />} />
                <Route path="/approval/request" element={<ApprovalRequestPage />} />
                <Route path="/approval/status" element={<ApprovalPage />} />
                <Route path="/approval/temp" element={<ApprovalTempPage />} />
                <Route path="/test-approval" element={<ApprovalDetail />} />
                <Route path="/approval/detail/:id" element={<ApprovalDetail />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;