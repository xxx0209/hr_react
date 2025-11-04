import React, { useState } from 'react';
import './ClockButtons.css';

const ClockButtons = ({ onRecord }) => {
    const [clockInTime, setClockInTime] = useState(null);
    const [clockOutTime, setClockOutTime] = useState(null);

    const handleClockIn = () => {
        const now = new Date().toLocaleTimeString();
        setClockInTime(now);
        onRecord({ type: 'clockIn', time: now });
    };

    const handleClockOut = () => {
        const now = new Date().toLocaleTimeString();
        setClockOutTime(now);
        onRecord({ type: 'clockOut', time: now });
    };

    return (
        <div>
            <button onClick={handleClockIn}>출근</button>
            <button onClick={handleClockOut}>퇴근</button>
        </div>
    );
};

export default ClockButtons;