import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext'; // ✅ context (복수 아님!)
// import { useParams } from 'react-router-dom'; //문서 ID 등 URL 파라미터
import './ApprovalDetail.css'; //스타일 파일 (선택)

function ApprovalDetail() {
    const [status, setStatus] = useState("결재대기");
    const { user } = useContext(AuthContext); //로그인한 사용자 정보
    // const { documentId } = useParams(); //문서 ID 추출

    console.log("현재 사용자 역할:", user.role); // ← 여기 넣으면 돼!

    //버튼 클릭 핸들러 (기본 틀)
    const handleApprove = () => {
        //승인 처리 로직
        setStatus("승인완료");
        alert("승인되었습니다!");
        console.log("승인 버튼 클릭됨");
        //나중에 API 호출 또는 상태 변경 추가 가능
    };

    const handleReject = () => {
        //반려 처리 로직
        setStatus("반려");
        alert("반려되었습니다!")
        console.log("반려 버튼 클릭됨");
        //나중에 반려 사유 입력창 추가 가능
    };

    const handleBack = () => {
        //목록으로 돌아가기
        window.history.back(); //이전 페이지로 이동
    };

    return (
        <div className="approval-detail">
            <h2>결제 상세 페이지</h2>
            <p>현재 상태: {status}</p>

            {/* 문서 내용 영역 (추후 API 연동) */}
            <div className="document-content">
                <p>문서 내용이 여기에 표시됩니다.</p>
            </div>

            {/* 버튼 영역 */}
            <div className="button-group">
                {user.role === '관리자' && (
                    <>
                        <button onClick={handleApprove}>승인</button>
                        <button onClick={handleReject}>반려</button>
                        <button onClick={handleBack}>목록</button>
                    </>
                )}

            </div>
        </div>
    );
}

export default ApprovalDetail;