import React, { useContext } from 'react';
import { AuthContext } from '../contextx/AuthContext'; //사용자 정보 comtext
import { useParams } from 'react-router-dom'; //문서 ID 등 URL 파라미터
import './ApprovalDetail.css'; //스타일 파일 (선택)

function ApprovalDetail() {
    const { user } = useContext(AuthContext); //로그인한 사용자 정보
    const { documentId } = useParams(); //문서 ID 추출

    //버튼 클릭 핸들러 (기본 틀)
    const handleApprove = () => {
        //승인 처리 로직
        console.log('승인 처리:', documentId);
    };

    const handleReject = () => {
        //반려 처리 로직
        console.log('반려 처리:', documentId);
    };

    const handleBack = () => {
        //목록으로 돌아가기
        window.history.back();
    };

    return (
        <div className="approval-detail">
            <h2>결제 상세 페이지</h2>

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
                    </>
                )}
                <button onClick={handleBack}>목록</button>
            </div>
        </div>
    );
}

export default ApprovalDetail;