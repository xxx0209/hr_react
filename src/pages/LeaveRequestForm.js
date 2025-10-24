import React, { useState } from "react";

function LeaveRequestForm({ onSubmit }) {
    const [type, setType] = useState("연차");
    const [date, setDate] = useState(() => {
        const today = new Date().toISOString().split("T")[0];
        return today;
    });
    const [reason, setReason] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRequest = {
            type,
            date,
            status: "결재대기",
            reason,
        };
        onSubmit(newRequest); //부모 컴포넌트로 전달
        setType("연차");
        setDate(new Date().toISOString().split("T")[0]);
        setReason("");
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
            <h3>휴가 신청 폼</h3>

            <label>
                휴가 종류:
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="연차">연차</option>
                    <option value="반차">반차</option>
                    <option value="반반차">반반차</option>
                </select>
            </label>

            <br />

            <label>
                사용일자:
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>

            <br />

            <label>
                신청 사유:
                <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
            </label>

            <br />

            <button type="submit">신청하기</button>
        </form>

    );
}

export default LeaveRequestForm;