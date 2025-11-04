
import React, { useState, useEffect } from "react";
import UserInfoCard from '../components/UserInfoCard';
import ClockButtons from '../components/ClockButtons';
import AttendanceHistory from '../components/AttendanceHistory';

function AttendanceTracker() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('attendanceRecords');
        if (saved) {
            setAttendanceRecords(JSON.parse(saved));
        }
    }, []);

    const handleRecord = ({ type, time }) => {
        const today = new Date().toISOString().split('T')[0];
        const existing = attendanceRecords.find(r => r.date === today);

        let updated;
        if (existing) {
            updated = attendanceRecords.map(r =>
                r.date === today
                    ? { ...r, [type === 'clockIn' ? 'clockIn' : 'clockOut']: time }
                    : r
            );
        } else {
            updated = [
                ...attendanceRecords,
                {
                    date: today,
                    clockIn: type === 'clockIn' ? time : null,
                    clockOut: type === 'clockOut' ? time : null,
                    status: '정상', //나중에 자동 판별 로직으로 바꿀 예정
                },
            ];
        }

        setAttendanceRecords(updated);
        localStorage.setItem('attendanceRecords', JSON.stringify(updated));
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '250px', padding: '16px' }}>
                <UserInfoCard
                    name="홍길동"
                    position="사원"
                    workType="정규직"
                />
            </div>
            <div style={{ flex: 1, padding: '16px' }}>
                <ClockButtons onRecord={handleRecord} />
                <div>
                    {attendanceRecords.map((record, index) => (
                        <div key={index}>
                            {record.status} - {record.time}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AttendanceTracker;
