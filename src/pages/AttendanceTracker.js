
import React, { useState, useEffect } from "react";
import UserInfoCard from '../components/UserInfoCard';
import ClockButtons from '../components/ClockButtons';

function AttendanceTracker() {
    //상태 정의
    const [clockInTime, setClockInTime] = useState(null);
    const [clockOutTime, setClockOutTime] = useState(null);
    const [workStatus, setWorkStatus] = useState("정상");
    const [weeklyStats] = useState({
        totalHours: "0h 0m",
        lateCount: 0,
        earlyLeaveCount: 0,
        absentCount: 0,
    });

    // const [leaveBalance, setLeaveBalance] = useState({
    //     annual: 4.5,       //연차
    //     half: 2,           //반차
    //     quarter: 1         //반반차
    // });

    // const [recentRequests, setRecentRequests] = useState([
    //     //예시 데이터
    //     { type: "연차", date: "2025-10-20", status: "결재대기" },
    //     { type: "반차", date: "2025-10-18", status: "승인완료" },
    //     { type: "반반차", date: "2025-10-15", status: "반려" }
    // ]);

    // const [calendarEvents, setCalendarEvents] = useState([
    //     //승인된 휴가만 표시
    //     { date: "2025-10-18", type: "반차", status: "승인완료" }
    // ]);

    useEffect(() => {
        const storedClockIn = localStorage.getItem("clockInTime");
        const storedClockOut = localStorage.getItem("clockOutTime");
        if (storedClockIn) setClockInTime(storedClockIn);
        if (storedClockOut) setClockOutTime(storedClockOut);
    }, []);

    const handleClockIn = () => {
        const now = new Date().toLocaleTimeString();
        setClockInTime(now);
        localStorage.setItem("clockInTime", now);
    };

    const handleClockOut = () => {
        const now = new Date().toLocaleTimeString();
        setClockOutTime(now);
        localStorage.setItem("clockOutTime", now);
    };

    const user = {
        name: '승규',
        position: '대리',
        workType: '정규직',
    };

    return (
        <div>
            <UserInfoCard name="승규" position="대리" workType="정규직" />
            <ClockButtons
                clockInTime={clockInTime}
                clockOutTime={clockOutTime}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
            />
        </div>
    );
}

export default AttendanceTracker;
