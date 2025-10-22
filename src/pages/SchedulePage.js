import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

// 날짜를 단순히 1~30으로 생성 (예제용)
const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateClick = (day) => {
        setSelectedDate(day);
    };

    return (
        <Container className="my-5">
            {/* 상단 헤더 */}
            <Row className="mb-4 align-items-center">
                <Col><h3>📅 2025년 10월</h3></Col>
                <Col className="text-end">
                    <Button variant="outline-secondary" className="me-2">이전</Button>
                    <Button variant="outline-secondary">다음</Button>
                </Col>
            </Row>

            <Row>
                {/* 왼쪽 달력 */}
                <Col md={8}>
                    <Card className="p-3">
                        <Row xs={7} className="text-center fw-bold mb-2">
                            {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                                <Col key={d}>{d}</Col>
                            ))}
                        </Row>

                        <Row xs={7} className="text-center g-2">
                            {daysInMonth.map((day) => (
                                <Col key={day}>
                                    <Button
                                        variant={selectedDate === day ? 'primary' : 'light'}
                                        className="w-100"
                                        onClick={() => handleDateClick(day)}
                                    >
                                        {day}
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>

                {/* 오른쪽 스케줄 표시 */}
                <Col md={4}>
                    <Card className="p-3 h-100">
                        <h5>🗓️ 선택한 날짜: {selectedDate ? `10월 ${selectedDate}일` : '없음'}</h5>
                        <hr />
                        {selectedDate ? (
                            <ul>
                                <li>회의 - 오전 10시</li>
                                <li>점심 약속 - 오후 12시</li>
                            </ul>
                        ) : (
                            <p>날짜를 선택하세요.</p>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default SchedulePage;