import React, { useState, useEffect } from "react";
import { Button, Typography, Checkbox, Table, TableRow, TableCell, TableHead, TableBody } from "@mui/material";
import { checkin, checkout, getStatus, getList } from "../../api/attendance";
import { Pagination } from "react-bootstrap";

const AttendancePage = () => {
    const [status, setStatus] = useState("출근 전");
    const [records, setRecords] = useState([]);
    const [checked, setChecked] = useState(false);
    const [page, setPage] = useState(1); // 현재 페이지 (1부터 시작)
    const [pageSize, setPageSize] = useState(5); // 페이지 크기 (한 번에 보여줄 항목 수)
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수


    useEffect(() => {
        const fetchStatus = async () => {
            const result = await getStatus();
            setStatus(result);
        };
        const fetchList = async () => {
            const list = await getList(page - 1, pageSize);
            setRecords(list);
        };
        fetchStatus();
        fetchList();
    }, [page, pageSize]);

    const handleCheckin = async () => {
        await checkin();
        //setStatus("출근 완료");
        const result = await getStatus();
        setStatus(result);
        const updatedList = await getList(page - 1, pageSize); //✅ 테이블 갱신
        setRecords(updatedList);
    };

    const handleCheckout = async () => {
        await checkout();
        //setStatus("퇴근 완료");
        const result = await getStatus();
        setStatus(result);
        const updatedList = await getList(page - 1, pageSize); //✅ 테이블 갱신
        setRecords(updatedList);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div style={{ padding: "30px" }}>
            <Typography variant="h4" gutterBottom>출퇴근 상태 관리</Typography>
            <Typography variant="subtitle1">오늘 출근 상태: {status}</Typography>

            <div style={{ marginTop: "20px" }}>
                <Button variant="contained" color="primary" onClick={handleCheckin}>출근</Button>
                <Button variant="contained" color="secondary" onClick={handleCheckout} style={{ marginLeft: "10px" }}>퇴근</Button>
            </div>

            <div style={{ marginTop: "30px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>날짜</TableCell>
                            <TableCell>출근 시간</TableCell>
                            <TableCell>퇴근 시간</TableCell>
                            <TableCell>상태</TableCell>
                            {/* <TableCell>열람</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} style={{ textAlign: "center", color: "gray" }}>
                                    데이터가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            records.map((record, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{record.date}</TableCell>
                                    <TableCell>{record.checkInTime}</TableCell>
                                    <TableCell>{record.checkOutTime || "-"}</TableCell>
                                    <TableCell>{record.status}</TableCell>
                                    {/* <TableCell>
                                        <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
                                    </TableCell> */}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* 페이지네이션 */}
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1} // 첫 페이지에서는 이전 페이지 버튼 비활성화
                        />

                        {/* 페이지 번호 항목 */}
                        {[...Array(totalPages).keys()].map((p) => (
                            <Pagination.Item
                                key={p}
                                active={p === page - 1}  // 현재 페이지가 활성화된 상태
                                onClick={() => handlePageChange(p + 1)}  // 페이지 클릭 시
                            >
                                {p + 1}
                            </Pagination.Item>
                        ))}

                        <Pagination.Next
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages}  // 마지막 페이지에서는 다음 페이지 버튼 비활성화
                        />
                    </Pagination>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;