import React, { useState } from "react";
import LeaveForm from "./LeaveForm";

const LeaveRequestForm = () => {
    const [formData, setFormData] = useState({});
    const [reason, setReason] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!formData.leaveType || !formData.startDate || !reason) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("/api/leave/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    reason,
                    status: "결재 대기"
                })
            });

            if (response.ok) {
                alert("휴가 신청이 완료되었습니다.");
                setSubmitted(true);
            } else {
                alert("신청 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <LeaveForm onChange={setFormData} />

            <label>신청 사유</label>
            <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="휴가 사유를 입력하세요" />

            <button onClick={handleSubmit} disabled={submitted}>
                신청하기
            </button>
        </div>
    );
};

export default LeaveRequestForm;