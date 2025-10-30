import { useEffect, useState } from "react";
import { Table, Button, Pagination, Container } from "react-bootstrap";
import axios from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function PositionListPage() {
    const [positions, setPositions] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    const fetchPositions = async () => {
        const data = await axios.get(`/position/list?page=${page}&size=${5}`).then(res => res.data);
        setPositions(data.content);
        setTotalPages(data.totalPages);
    };

    useEffect(() => { fetchPositions(); }, [page]);

    return (
        <Container style={{ marginTop: "30px" }}>
            <h2>직급 목록</h2>
            <Button onClick={() => navigate("/member/position")} className="mb-3">직급 등록</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>코드</th>
                        <th>이름</th>
                        <th>설명</th>
                        <th>활성</th>
                        <th>상세/수정</th>
                    </tr>
                </thead>
                <tbody>
                    {positions.map(p => (
                        <tr key={p.positionId}>
                            <td>{p.positionId}</td>
                            <td>{p.positionCode}</td>
                            <td>{p.positionName}</td>
                            <td>{p.description}</td>
                            <td>{p.active ? "Y" : "N"}</td>
                            <td>
                                <Button size="sm" onClick={() => navigate(`/member/position/${p.positionId}`)}>상세/수정</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination>
                <Pagination.Prev onClick={() => setPage(prev => Math.max(prev - 1, 0))} />
                {[...Array(totalPages).keys()].map(p => (
                    <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>{p + 1}</Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))} />
            </Pagination>
        </Container>
    );
};