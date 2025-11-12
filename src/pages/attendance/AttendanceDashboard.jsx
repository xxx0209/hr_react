import React from 'react';
import AttendanceSubMenu from "../../ui/AttendanceSubMenu";
import AttendanceBarChart from '../../components/AttendanceBarChart';

const dummyRecords = [
    {
        checkIn: "2023-09-01T08:00:00",
        checkOut: "2023-09-01T17:00:00",
    },
    {
        checkIn: "2023-09-02T09:00:00",
        checkOut: "2023-09-02T18:00:00",
    },
    {
        checkIn: "2023-09-03T08:30:00",
        checkOut: "2023-09-03T17:30:00",
    },
];

function parseHour(time) {
    return new Date(time).getHours();
}

function parseDate(time) {
    const date = new Date(time);
    return `${date.getMonth() + 1}/${date.getDate()}`; //MM/DD
}

function generateChartData(records) {
    const labels = records.map((r) => parseDate(r.checkIn));
    const datasets = [
        {
            label: "출근 시간",
            data: records.map((r) => parseHour(r.checkIn)),
            backgroundColor: "#A0D2E2",
        },
        {
            label: "퇴근 시간",
            data: records.map((r) => parseHour(r.checkOut)),
            backgroundColor: "#F7A072",
        },
    ];

    return { labels, datasets };
}

const AttendanceDashboard = () => {
    const chartData = generateChartData(dummyRecords);

    console.log("chartData", chartData);

    return (
        <div style={{ padding: "2rem" }} >
            <h2>출석 현황</h2>
            <AttendanceSubMenu />
            <AttendanceBarChart data={chartData} />
        </div >
    );
};


export default AttendanceDashboard;