import React, { useState, useEffect } from "react";
import ClockButtons from "../../components/ClockButtons";

export default function AttendancePage() {
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);

    useEffect(() => {
        const storedCheckIn = localStorage.getItem("checkInTime");
        const storedCheckOut = localStorage.getItem("checkOutTime");
        if (storedCheckIn) setCheckInTime(storedCheckIn);
        if (storedCheckOut) setCheckOutTime(storedCheckOut);
    }, []);

    const handleCheckIn = () => {
        const now = new Date().toLocaleTimeString();
        localStorage.setItem("checkInTime", now);
        setCheckInTime(now);
    };

    const handleCheckOut = () => {
        const now = new Date().toLocaleTimeString();
        localStorage.setItem("checkOutTime", now);
        setCheckOutTime(now);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>출퇴근 관리</h2>
            <button onClick={handleCheckIn}>출근</button>
            <button onClick={handleCheckOut} style={{ marginLeft: "10px" }}>퇴근</button>

            <div style={{ marginTop: "20px" }}>
                <ClockButtons />
                <p>출근 시간: {checkInTime || "미기록"}</p>
                <p>퇴근 시간: {checkOutTime || "미기록"}</p>
            </div>
        </div>
    );
}

