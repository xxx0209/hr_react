import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ScheduleCalendarWithForm from "../pages/SchedulePage";
import SignupPage from "../pages/SignupPage";
import ApprovalPage from "../pages/ApprovalPage";
import AttendanceTracker from "../pages/AttendanceTracker";
import LeaveStatus from "../pages/LeaveStatus";

import ApprovalRequestPage from "../pages/ApprovalRequestPage";
import ApprovalTempPage from "../pages/ApprovalTempPage";
import SalaryPage from "../pages/SalaryPage";

// 이 파일은 라우팅 정보를 담고 있는 파일입니다.
// 이러한 파일을 네트워크에서는 routing table이라고 합니다.
function App() {
    // user : 사용자 정보를 저장하고 있는 객체
    // handleLoginSuccess : 로그인 성공시 동작할 액션
    return (
        <Routes>
            {/* path 프롭스는 요청 정보 url, element 프롭스는 컴포넌트 이름 */}
            <Route path="/" element={<Navigate to="/home" />} />
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
            <Route path="/approval" element={<ApprovalPage />} />

            {/* 급여 관련 페이지 */}
            <Route path="/salary" element={<SalaryPage />} />


        </Routes>
    );
}

export default App;