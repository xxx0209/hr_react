import React from 'react';
import { getStatusColor } from "../utils/statusColor";

type StatusType = '출근' | '퇴근' | '지각' | '결근';

interface AttendanceCardProps {
    name: string;
    status: string;
    time?: string;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ name, status, time }) => {
    const statusColor = getStatusColor(status);

    const renderTime = () => {
        if (status === "결근") return null;
        if (status === "퇴근" && time === "") return <p>출근 시간: -</p>;
        if (status === "지각") {
            return <p style={{ color: "#F44336", fontWeight: "bold" }}>출근 시간: {time}</p>;
        }
        return <p>출근 시간: {time}</p>;
    };

    return (
        <div style={{
            border: `2px solid ${statusColor}`,
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "10px",
            backgroundColor: "#fff",
            boxShadow: `0 0 5px ${statusColor}`
        }}>
            <h3>{name}</h3>
            <p style={{ color: statusColor, fontWeight: "bold" }}>{status}</p>
            {renderTime()}
        </div>
    );
};

export default AttendanceCard;