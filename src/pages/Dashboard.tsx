import React from 'react';
import { useState, useEffect } from 'react';
import LeaveCard from '../components/LeaveCard';
import WeeklySummaryCard from '../components/WeeklySummaryCard';
import { LeaveCardProps, WeeklySummaryProps } from '../types';

const Dashboard = () => {
    const [leaveData, setLeaveData] = useState<LeaveCardProps | null>(null);
    const [summaryData, setSummaryData] = useState<WeeklySummaryProps | null>(null);

    useEffect(() => {
        const dummyLeave: LeaveCardProps = {
            used: 10,
            remaining: 20,
            expirationDate: '2023-08-12',
        };

        const dummySummary: WeeklySummaryProps = {
            totalWorkHours: 38.3,
            breakHours: 4.5,
            overtimeHours: 6.1,
        };

        setLeaveData(dummyLeave);
        setSummaryData(dummySummary);
    }, []);

    return (
        <div className="dashboard">
            <div>Hi there!</div>
            <div>Here's a quick summary:</div>
            <div className="dashboard-cards">
                {summaryData ? (
                    <WeeklySummaryCard {...summaryData} />
                ) : (
                    <p>요약 데이터를 불러오는 중입니다...</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;