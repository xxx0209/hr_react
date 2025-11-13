import React from 'react';
import { Bar } from "react-chartjs-2";
import { fetchAttendanceData } from "../../api/attendance";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AttendanceDashboard = ({ chartData = [] }) => {
    const labels = chartData.map((data) => data.date);
    const datasets = [
        {
            label: "출근시간",
            data: chartData.map((data) => data.clockIn),
            backgroundColor: "#4CAF50",
        },
        {
            label: "퇴근시간",
            data: chartData.map((data) => data.clockOut),
            backgroundColor: "#F44336",
        },
    ];

    return (
        <div className="p-6">
            <Bar
                data={{ labels, datasets }}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { position: "top" },
                        title: { display: true, text: "출석 시간 비교" },
                    },
                }}
            />
        </div >
    );
};


export default AttendanceDashboard;