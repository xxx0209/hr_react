import React, { useState, useEffect } from 'react';
import api from '../api/api'; // 
import { Button, Table, Badge } from 'react-bootstrap';

const ApprovalsPage = ({ user }) => {
    const [approvals, setApprovals] = useState([]);

    useEffect(() => {
        fetchApprovals();
    }, []);

    // 변경: status === '결재요청'인 문서만 필터링해서 조회
    const fetchApprovals = async () => {
        try {
            const res = await api.get('/api/requests');
            const filtered = res.data.filter(r => r.status === '결재요청');
            setApprovals(filtered);
        } catch (err) {
            console.error('결재요청 문서 불러오기 실패:', err);
            alert('승인 목록을 불러오는 중 오류가 발생했습니다.');
        }
    };

    // 승인 처리
    const handleApprove = async (id) => {
        try {
            await api.patch(`/api/requests/${id}/approve`);
            alert('승인 완료!');
            fetchApprovals();
        } catch (err) {
            console.error(err);
            alert('승인 처리 중 오류가 발생했습니다.');
        }
    };

    // 반려 처리
    const handleReject = async (id) => {
        try {
            const reason = prompt('반려 사유를 입력하세요');
            if (!reason) return;

            await api.patch(`/api/requests/${id}/reject`, { comment: reason });
            alert('반려 완료!');
            fetchApprovals();
        } catch (err) {
            console.error(err);
            alert('반려 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">🧾 결재 요청 문서 목록</h2>
            <Table striped bordered hover className="table-light table-hover">
                <thead>
                    <tr className="text-center">
                        <th>번호</th>
                        <th>작성자</th>
                        <th>종류</th>
                        <th>기간</th>
                        <th>내용</th>
                        <th>상태</th>
                        <th>결재</th>
                    </tr>
                </thead>
                <tbody>
                    {approvals.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center text-muted">
                                결재 요청이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        approvals.map((r, index) => (
                            <tr key={r.id} className="text-center">
                                <td>{index + 1}</td>
                                <td>{r.memberName}</td>
                                <td>{r.requestType}</td>
                                <td>
                                    {r.startDate?.slice(0, 10)} ~ {r.endDate?.slice(0, 10)}
                                </td>
                                <td>{r.content}</td>
                                <td>
                                    <Badge
                                        bg={
                                            r.status === '결재요청'
                                                ? 'warning'
                                                : r.status === '승인'
                                                ? 'success'
                                                : r.status === '반려'
                                                ? 'danger'
                                                : 'secondary'
                                        }
                                    >
                                        {r.status}
                                    </Badge>
                                </td>
                                <td>
                                    {/* 변경: 관리자만 승인/반려 가능 */}
                                    {user?.roles?.some(role => role.authority === 'ROLE_ADMIN') && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline-success"
                                                className="me-2"
                                                onClick={() => handleApprove(r.id)}
                                            >
                                                승인
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => handleReject(r.id)}
                                            >
                                                반려
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default ApprovalsPage;
