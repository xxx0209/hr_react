import React, { useEffect, useState } from "react";

const AdminApprovalPanel = () => {
    const [requests, setRequests] = useState([]);

    //휴가 신청 목록 불러오기
    useEffect(() => {
        fetch("/request/list") //백엔드에서 전체 신청 목록 가져오는 API
            .then(res => res.json())
            .then(data => setRequests(data));
    }, []);

    //승인/반려 처리
    const handleDecision = async (id, decision) => {
        const endpoint = decision === "승인" ? "approve" : "reject";
        await fetch(`/request/${endpoint}/${id}`, {
            method: "PUT"
        });
        alert(`${decision} 처리 완료`);
        //목록 새로고침
        setRequests(prev => prev.filter(req => req.id !== id));
    };

    return (
        <div className="container mt-5">
            <h2>휴가 결재 요청 목록</h2>
            {requests.map(req => (
                <div key={req.id} className="card mb-3 p-3">
                    <p><strong>신청자:</strong>{req.userId}</p>
                    <p><strong>휴가 종류:</strong>{req.leaveType}</p>
                    <p><strong>기간:</strong>{req.startDate} ~ {req.endDate}</p>
                    <p><strong>사유:</strong>{req.reason}</p>
                    <p><strong>상태:</strong>{req.status}</p>
                    <button className="btn btn-success me-2" onClick={() => handleDecision(req.id, "승인")}>승인</button>
                    <button className="btn btn-danger" onClick={() => handleDecision(req.id, "반려")}>반려</button>
                </div>
            ))}
        </div>
    );
};

export default AdminApprovalPanel;