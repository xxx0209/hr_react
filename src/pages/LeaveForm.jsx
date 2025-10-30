import React, { useState, useEffect } from "react";

const LeaveForm = ({ onChange }) => {
    const [leaveType, setLeaveType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [timeRange, setTimeRange] = useState("");

    //휴가 종류에 따라 날짜/시간 자동 설정
    useEffect(() => {
        if (leaveType === "반차") {
            setEndDate(startDate);
            setTimeRange("09:00 ~ 13:00"); //예시: 오전 반차
        } else if (leaveType === "반반차") {
            setEndDate(startDate);
            setTimeRange("09:00 ~ 11:00"); //예시: 오전 반반차        
        } else {
            setTimeRange("");
        }

        //부모 컴포넌트로 값 전달
        if (onChange) {
            onChange({ leaveType, startDate, endDate, timeRange });
        }
    }, [leaveType, startDate, endDate]);

    return (
        <div className="leave-form">
            <h3>휴가 신청 입력</h3>

            {/* 휴가 종류 선택 */}
            <label>휴가 종류</label>
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                <option value="">선택하세요</option>
                <option value="연차">연차</option>
                <option value="반차">반차</option>
                <option value="반반차">반반차</option>
            </select>

            {/* 시작일 선택 */}
            <label>시작일</label>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)} />

            {/* 종료일: 연차일 경우만 표시 */}
            {leaveType === "연차" && (
                <>
                    <label>종료일</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)} />
                </>
            )}

            {/* 시간 자동 표시: 반차/반반차일  경우만 표시 */}
            {(leaveType === "반차" || leaveType === "반반차") && (
                <>
                    <label>시간</label>
                    <input type="text" value={timeRange} readOnly />
                </>
            )}
        </div>
    );
};

export default LeaveForm;