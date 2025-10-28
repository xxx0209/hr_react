import React, { useState } from "react";

function LeaveRequestForm() {
    const [type, setType] = useState("연차");
    const [date, setDate] = useState(() => {
        const today = new Date().toISOString().split("T")[0];
        return today;
    });
    const [reason, setReason] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        //TODO: 백엔드 연동 or 상태 저장
        console.log('휴가 신청 정보:', {
            type,
            date,
            reason,
        });

        //상태 초기화
        setType('');
        setDate('');
        setReason('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
            <h2 className="mb-4">휴가 신청</h2>

            <div className="mb-3">
                <label htmlFor="type" className="form-label">휴가 종류</label>
                <select
                    id="type"
                    className="form-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required>

                    <option value="">-- 선택하세요 --</option>
                    <option value="annual">연차</option>
                    <option value="sick">병가</option>
                    <option value="half">반차</option>
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="date" className="form-label">사용일자</label>
                <input
                    type="date"
                    id="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required />
            </div>

            <div className="mb-3">
                <label htmlFor="reason" className="form-label">신청 사유</label>
                <input
                    type="text"
                    id="reason"
                    className="form-control"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="사유를 입력하세요"
                    required />
            </div >

            <button type="submit" className="btn brn-primary w-100">신청하기</button>
        </form>
    );
}

export default LeaveRequestForm;