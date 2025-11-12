import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { EnumProvider } from "./context/EnumContext"
import AppRoutes from './routes/AppRoutes';
// import AttendanceMenuList from './pages/AttendanceMenuList';
// import AttendanceDashboardList from './pages/AttendanceDashboardList';
import AttendanceDashboard from './pages/attendance/AttendanceDashboard'; //우리가 만든 컴포넌트

function App() {
    return (
        // 브라우저의 주소(URL)를 감시하고 그에 맞게 컴포넌트를 렌더링
        <BrowserRouter>
            {/* // 로그인 상태, 사용자 정보, 토큰 등을 전역으로 관리하기 위한 Context Provider */}
            <AuthProvider>
                {/* 상수(enum) 데이터나 공용 코드 목록 등을 앱 전역에서 공유하기 위한 Context Provider */}
                <EnumProvider>
                    {/* 실제 라우팅 설정을 정의한 컴포넌트  */}
                    <Routes>
                        {/* <Route path="/dashboard-list" element={<AttendanceDashboardList />} />
                        <Route path="/menu-list" element={<AttendanceMenuList />} /> */}
                        <Route path="/attendance" element={<AttendanceDashboard />} />
                    </Routes>
                    <AppRoutes />
                </EnumProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;