import React from "react";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AttendanceBarChart = ({ data }) => {
    console.log("Bar chart data", data);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw}시`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: (value) => `${value}시`,
                },
            },
        },
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", height: "300px" }}>
            <Bar data={data} options={options} />
        </div>
    )
}

export default AttendanceBarChart;