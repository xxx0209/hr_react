import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';

const ApprovalsPage = ({ user }) => {
    const [approvals, setApprovals] = useState([]);

    useEffect(() => {
        fetchApprovals();
    }, []);

    const fetchApprovals = async () => {
        try {
            const res = await axios.get('/api/approvals');
            setApprovals(res.data);
        } catch (err) {
            console.error(err);
            alert('승인 목록을 불러오는 중 오류가 발생했습니다.');
        }
    };

    const updateApprovalList = (id, updatedItem) => {
        const updated = approvals.map(a => a.id === id ? updatedItem : a);
        setApprovals(updated);
    };

    const handleApprove = async (id) => {
        try {
            const res = await axios.putForm(`/api/documents/${id}/approve`, {
                approver: user.name,
                approvedAt: new Date().toISOString(),
                signature: user.signatureUrl,
            });
            updateApprovalList(id, res.data);
            alert('승인 완료!');
        } catch (err) {
            console.error(err);
            alert('승인 처리 중 오류가 발생했습니다.');
        }
    };

    const handleReject = async (id) => {
        try {
            const reason = prompt('반려 사유를 입력하세요');
            if (!reason) return;

            const res = await axios.put(`/api/documents/${id}/reject`, {
                approver: user.name,
                rejectedAt: new Date().toISOString(),
                reason,
            });
            updateApprovalList(id, res.data);
            alert('반려 완료!');
        } catch (err) {
            console.error(err);
            alert('반려 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">승인결재 문서 목록</h2>
            <Table striped bordered hover className="table-light table-hover">
                <thead>
                    <tr className="text-center">
                        <th>번호</th>
                        <th>문서 코드</th>
                        <th>문서 제목</th>
                        <th>기안자</th>
                        <th>기안일</th>
                        <th>결재 의견</th>
                        <th>결재</th>
                    </tr>
                </thead>
                <tbody>
                    {approvals.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">결재 요청이 없습니다.</td>
                        </tr>
                    ) : (
                        approvals.map((a, index) => (
                            <tr key={a.id} className="text-center">
                                <td>{index + 1}</td>
                                <td>{a.code}</td>
                                <td>{a.title}</td>
                                <td>{a.requester}</td>
                                <td>{a.date}</td>
                                <td>{a.comment || '-'}</td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="outline-success"
                                        className="me-2"
                                        onClick={() => handleApprove(a.id)}>
                                        승인
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => handleReject(a.id)}>
                                        반려
                                    </Button>
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