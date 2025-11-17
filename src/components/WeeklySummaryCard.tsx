import React from 'react';
import ProgressBar from './ProgressBar';
import StatCard from './StatCard';

interface WeeklySummaryProps {
    totalWorkHours: number;
    breakHours: number;
    overtimeHours: number;
    goalHours?: number;
}

const WeeklySummaryCard: React.FC<WeeklySummaryProps> = ({
    totalWorkHours,
    breakHours,
    overtimeHours,
    goalHours = 45,
}) => {
    const actualWorkHours = totalWorkHours - breakHours;
    const progress = Math.min((totalWorkHours / goalHours) * 100, 100);

    return (
        <div className="weekly-summary-card">
            <h3>📊 주간 누적 시간 요약</h3>

            <ProgressBar value={progress} label={`${totalWorkHours.toFixed(1)}시간 / 목표 ${goalHours}시간`} />

            <div className="stat-card-group">
                <StatCard label="실제 근무 시간" value={`${actualWorkHours.toFixed(1)}시간`} icon="✅" />
                <StatCard label="휴게 시간" value={`${breakHours.toFixed(1)}시간`} icon="🍱" />
                <StatCard label="초과 근무" value={`${overtimeHours.toFixed(1)}시간`} icon="🌙" />
            </div>
        </div>
    );
};

export default WeeklySummaryCard;