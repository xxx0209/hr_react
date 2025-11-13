import React from "react";
import { checkIn, checkOut } from "../api/attendance";
import './ClockButtons.css';

const ClockButtons = () => {
    const handleCheckIn = async () => {
        try {
            await checkIn();
            alert("출근 완료!");
        } catch (err) {
            console.error("출근 실패:", err);
            alert("출근 실패 😢");
        }
    };

    const handleCheckOut = async () => {
        try {
            await checkOut();
            alert("퇴근 완료!");
        } catch (err) {
            console.error("퇴근 실패:", err);
            alert("퇴근 실패 😢");
        }
    };

    return (
        <div className="flex gap-4 mt-4">
            <button
                onClick={handleCheckIn}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                출근
            </button>
            <button
                onClick={handleCheckOut}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                퇴근
            </button>
        </div>
    );
};

export default ClockButtons;