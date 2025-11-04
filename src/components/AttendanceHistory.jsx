import React from 'react';
import './AttendanceHistory.css';

const AttendanceHistory = ({ records }) => {
    return (
        <div className="attendance-history">
            <h3>출퇴근 내역 (최근 7일)</h3>
            <table>
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>출근</th>
                        <th>퇴근</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((day, index) => (
                        <tr key={index}>
                            <td>{day.date}</td>
                            <td>{day.clockIn || '미기록'}</td>
                            <td>{day.clockOut || '미기록'}</td>
                            <td>{day.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AttendanceHistory;