import React from 'react';
import AttendanceCard from '../components/AttendanceCard'
import LeaveCard from "../components/LeaveCard";
import { useNavigate } from "react-router-dom";

type StatusType = '출근' | '퇴근' | '지각' | '결근';

interface AttendanceInfo {
    name: string;
    status: StatusType;
    time: string;
}

const AttendanceData: AttendanceInfo[] = [
    { name: '홍길동', status: '출근', time: '09:03' },
    { name: '김철수', status: '퇴근', time: '18:12' },
    { name: '이영희', status: '지각', time: '09:45' },
];

const leaveData = [
    { date: "2025-10-12", type: "연차", reason: "개인 일정" },
    { date: "2025-10-25", type: "반차", reason: "병원 방문" },
    { date: "2025-11-01", type: "연차", reason: "가족 행사" },
];

<LeaveCard leaves={leaveData} />

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>대시보드</h2>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button onClick={() => navigate("/attendance")}>근태 바로가기</button>
                <button onClick={() => navigate("/leave")}>휴가 바로가기</button>
            </div>

            <AttendanceCard name="이승규" status="출근" time="09:03" />
            <LeaveCard leaves={leaveData} />
        </div>
    );
};

export default Dashboard;