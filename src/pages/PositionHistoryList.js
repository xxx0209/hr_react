import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "../api/api";

export default function PositionHistoryList({ onAdd }) {
    const [list, setList] = useState([]);

    useEffect(() => {
        axios.get("/position/history/list").then((res) => setList(res.data));
    }, []);

    return (
        <div>
            <h3>직급 변경 이력</h3>
            <Button variant="primary" onClick={onAdd}>+ 추가</Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>회원ID</th>
                        <th>이전 직급</th>
                        <th>변경 직급</th>
                        <th>사유</th>
                        <th>변경일시</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.memberId}</td>
                            <td>{item.oldPositionId || "-"}</td>
                            <td>{item.newPositionId}</td>
                            <td>{item.changeReason}</td>
                            <td>{item.changedAt?.substring(0, 19)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}