
import React, { useState, useEffect } from "react";


function AttendanceTracker() {
    //상태 정의
    const [clockInTime, setClockInTime] = useState(null);
    const [clockOutTime, setClockOutTime] = useState(null);
    const [workStatus, setWorkStatus] = useState("정상");
    const [weeklyStats, setWeeklyStats] = useState({
        totalHours: "0h 0m",
        lateCount: 0,
        earlyLeaveCount: 0,
        absentCount: 0,
    });

    const [leaveBalance, setLeaveBalance] = useState({
        annual: 4.5,       //연차
        half: 2,           //반차
        quarter: 1         //반반차
    });

    const [recentRequests, setRecentRequests] = useState([
        //예시 데이터
        { type: "연차", date: "2025-10-20", status: "결재대기" },
        { type: "반차", date: "2025-10-18", status: "승인완료" },
        { type: "반반차", date: "2025-10-15", status: "반려" }
    ]);

    const [calendarEvents, setCalendarEvents] = useState([
        //승인된 휴가만 표시
        { date: "2025-10-18", type: "반차", status: "승인완료" }
    ]);

    useEffect(() => {
        const savedClockIn = localStorage.getItem("clockInTime");
        const savedClockOut = localStorage.getItem("clockOutTime");
        if (savedClockIn) setClockInTime(savedClockIn);
        if (savedClockOut) setClockOutTime(savedClockOut);
    }, []);

    const handleClockIn = () => {
        const now = new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
        });
        setClockInTime(now);
        localStorage.setItem("clockInTime", now);
    };

    const handleClockOut = () => {
        const now = new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
        });
        setClockOutTime(now);
        localStorage.setItem("clockOutTime", now);
    };

    const handleStatusChange = () => {
        const nextStatus =
            workStatus === "정상"
                ? "재택"
                : workStatus === "재택"
                    ? "외근"
                    : "정상";
        setWorkStatus(nextStatus);
    };

    const statusColor = {
        정상: "#666",
        재택: "#007bff",
        외근: "#ff9800",
    };

    const progressPercentage = 65; //예시 값, 나중에 계산해서 넣기.

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>출퇴근 기능 테스트</h2>

            <div style={{ marginTop: "20px" }}>
                <div style={{ marginBottom: "10px" }}>
                    <strong>이번 주 누적 근무 시간</strong>
                    <div style={{
                        background: "#eee",
                        borderRadius: "5px",
                        overflow: "hidden",
                        height: "20px",
                        marginTop: "5px"
                    }}>
                        <div style={{
                            width: `${progressPercentage}%`,
                            background: "#4caf50",
                            height: "100%",
                            transition: "width 0.3s ease"
                        }} />
                    </div>
                    <span>{weeklyStats.totalHours}</span>
                </div>
                <ul>
                    <li>지각: {weeklyStats.lateCount}회</li>
                    <li>조퇴: {weeklyStats.earlyLeaveCount}회</li>
                    <li>결근: {weeklyStats.absentCount}회</li>
                </ul>
            </div>

            <div style={{ color: statusColor[workStatus], fontWeight: "bold", marginBottom: "10px" }}>
                <strong>근무 상태:</strong> {workStatus}
                <button onClick={handleStatusChange} style={{ marginLeft: "10px" }}>
                    상태 변경
                </button>
            </div>

            <div style={{ marginTop: "20px" }}>
                <button onClick={handleClockIn}>출근</button>
                {clockInTime && <span> 출근 시간: {clockInTime}</span>}
            </div>

            <div style={{ marginTop: "10px" }}>
                <button onClick={handleClockOut}>퇴근</button>
                {clockOutTime && <span> 퇴근 시간: {clockOutTime}</span>}
            </div>

            <div style={{ marginTop: "20px" }}>
                <h4>주간 근무 통계</h4>
                <ul>
                    <li>총 근무 시간: {weeklyStats.totalHours}</li>
                    <li>지각 횟수: {weeklyStats.lateCount}</li>
                    <li>조퇴 횟수: {weeklyStats.earlyLeaveCount}</li>
                    <li>결근 횟수: {weeklyStats.absentCount}</li>
                </ul>
            </div>
        </div>
    );
}

export default AttendanceTracker;
