import React, { useState, useEffect } from "react";
import LeaveRequestForm from "./LeaveRequestForm";


function LeaveStatus() {
    const [leaveBalance] = useState({
        annual: 4.5,
        half: 2,
        quarter: 1,
    });

    const [calendarEvents] = useState([
        { date: "2025-10-18", type: "반차", status: "승인완료" }
    ]);

    const [recentRequests, setRecentRequests] = useState([
        { type: "연차", date: "2025-10-20", status: "결재대기" },
        { type: "반차", date: "2025-10-18", status: "승인완료" },
        { type: "반반차", date: "2025-10-15", status: "반려" }
    ]);

    useEffect(() => {
        const savedRequests = localStorage.getItem("recentRequests");
        if (savedRequests) {
            setRecentRequests(JSON.parse(savedRequests));
        }
    }, []);

    const handleNewRequest = (newRequest) => {
        const updated = [newRequest, ...recentRequests.slice(0, 2)];
        setRecentRequests(updated);
        localStorage.setItem("recentRequests", JSON.stringify(updated));
    };

    const statusColor = {
        결재대기: "#ff9800",
        승인완료: "#4caf40",
        반려: "#f44336"
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>휴가 현황 테스트</h2>

            {/* 남은 휴가 표시 */}
            <div style={{ marginBottom: "20px" }}>
                <strong>남은 휴가</strong>
                <ul>
                    <li>연차: {leaveBalance.annual}일</li>
                    <li>반차: {leaveBalance.half}개</li>
                    <li>반반차: {leaveBalance.quarter}개</li>
                </ul>
            </div>

            {/* 최근 신청 내역 */}
            <div style={{ marginBottom: "20px" }}>
                <strong>최근 휴가 신청 내역</strong>
                <ul>
                    {recentRequests.map((req, index) => (
                        <li key={index} style={{ color: statusColor[req.status] }}>
                            {req.date} - {req.type} ({req.status})
                        </li>
                    ))}
                </ul>
            </div>

            {/* ✅ 여기에 폼 삽입 */}
            <LeaveRequestForm onSubmit={handleNewRequest} />

            {/* 캘린더 표시 예정 휴가 */}
            <div>
                <strong>캘린더 표시 예정 휴가</strong>
                <ul>
                    {calendarEvents.map((event, index) => (
                        <li key={index}>
                            {event.date} - {event.type} ({event.status})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default LeaveStatus;