import React from 'react';
import './ClockButtons.css';

const ClockButtons = ({ clockInTime, clockOutTime, onClockIn, onClockOut }) => {
    return (
        <div className="clock-buttons">
            <button onClick={onClockIn}>출근</button>
            <button onClick={onClockIn}>퇴근</button>
            <div className="clock-times">
                <p>출근 시간: {clockInTime || '미기록'}</p>
                <p>퇴근 시간: {clockOutTime || '미기록'}</p>
            </div>
        </div>
    );
};

export default ClockButtons;