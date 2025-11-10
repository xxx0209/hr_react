import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Modal, Badge } from "react-bootstrap";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ko from "date-fns/locale/ko";
import axios from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@mui/material";
import { Button as BasicButton } from "react-bootstrap";

import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";

const locales = { ko };
const localizer = dateFnsLocalizer({
    format, parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales,
});

const ETC_SCHEDULE_LIST = ["checkIn", "checkOut"];

export default function SchedulePage() {
    const { user, setUser } = useContext(AuthContext);

    const [events, setEvents] = useState([]);
    const [checkEvents] = useState([
        {
            scheduleId: "checkIn",
            title: "출근",
            start: new Date("2025-10-30T09:05:00"),
            end: new Date("2025-10-30T09:05:00"),
            color: "#0d6efd",
            isCheck: true
        },
        {
            scheduleId: "checkOut",
            title: "퇴근",
            start: new Date("2025-10-30T17:25:00"),
            end: new Date("2025-10-30T17:25:00"),
            color: "#dc3545",
            isCheck: true
        }
    ]);

    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // ✅ 일정 조회
    useEffect(() => {
        setSelectedMember(user.memberId);

        if (!user.memberId) return;
        axios.get(`/schedule/member/${selectedMember}`)
            .then(res => {
                const mapped = res.data.map(e => ({
                    ...e,
                    start: new Date(e.start),
                    end: new Date(e.end),
                }));
                setEvents(mapped);
            });
    }, []);

    const handleSelectEvent = (event) => setSelectedEvent(event);

    // 겹치는 이벤트 색상 반투명 + 좌우 분리
    const eventPropGetter = (event, start, end, isSelected) => {
        // 기존 색상 유지 (event.color 없으면 기본값 지정)
        const baseColor = event.color || "#0d6efd"; // Bootstrap 기본 파랑

        // 헥사코드 → rgba 변환 함수
        const hexToRgba = (hex, alpha = 1) => {
            const bigint = parseInt(hex.replace("#", ""), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        // 같은 시간대 이벤트 간 좌우 분리용 인덱스
        // (겹치는 이벤트 정렬 시 계산해서 event.index 로 저장하거나,
        // 여기서 동적으로 계산해도 됨)
        const index = event.index || 0;

        return {
            style: {
                backgroundColor: hexToRgba(baseColor, 0.6), // ✅ 기존 색상 유지 + 투명도 60%
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "3px",
                //position: "relative",
                left: `${index * 10}%`, // ✅ 좌우 분리 (10%씩 밀기)
                width: `${100 - index * 10}%`, // ✅ 남은 폭 계산
                zIndex: 10 - index, // ✅ 겹칠 때 순서 보정
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transition: "all 0.2s ease-in-out",
            },
        };
    };

    const CustomToolbar = ({ date }) => {

        // date는 현재 캘린더의 기준 날짜
        const labelText = format(date, "yyyy-MM"); // YYYY-MM 형식

        return (
            <>
                {/* 첫 번째 줄: 제목 + 버튼 */}
                <Row className="align-items-center mb-2 px-3">
                    <Col className="d-flex justify-content-start px-0">
                        <h2>📆 스케줄 일정</h2>
                    </Col>
                    <Col className="d-flex justify-content-end px-0">
                        <BasicButton variant="outline-danger" size="sm">
                            바로가기
                        </BasicButton>
                    </Col>
                </Row>

                {/* 두 번째 줄: labelText */}
                <Row className="mb-3 px-0">
                    <Col className="d-flex justify-content-center px-0">
                        <div
                            style={{
                                fontWeight: "bold",
                                fontSize: "1.4rem",
                                padding: "6px 14px",
                                borderRadius: "12px",
                                backgroundColor: "#f0f4f8",
                                color: "#1e88e5",
                                minWidth: "100px",
                                textAlign: "center",
                            }}
                        >
                            {labelText}
                        </div>
                    </Col>
                </Row>
            </>
        );
    };

    const dayPropGetter = (date) => {
        const day = date.getDay();
        if (day === 0) { // 일요일
            return { style: { color: "#ff4d4f" } }; // 빨간색
        } else if (day === 6) { // 토요일
            return { style: { color: "#1890ff" } }; // 파란색
        }
        return {};
    };

    return (
        <Container className="py-4">
            <style>
                {`
                .rbc-event-content,
                    .rbc-event-label {
                        flex: 1;
                        font-size: 11px;
                        font-family: 'Inter', sans-serif;
                        font-variant-numeric: tabular-nums;
                        line-height: 1;
                        margin: 0;
                    }
                /* 일요일 빨강 */
                .rbc-header:nth-child(1) {
                    color: #dc3545;
                }
                /* 토요일 파랑 */
                .rbc-header:nth-child(7) {
                    color: #0d6efd;
                }
                    /* more 클릭 시 나오는 팝업 */
                .rbc-overlay {
                    font-family: 'Inter', sans-serif; /* 폰트 지정 */
                }

                /* 팝업 헤더(타이틀) */
                .rbc-overlay-header {
                    font-size: 16px;   /* 글자 크기 조절 */
                    font-weight: 600;  /* 글자 두께 */
                    padding: 8px 12px; /* 여백 */
                }

                /* 팝업 이벤트 리스트 글자 크기 */
                .rbc-overlay .rbc-event {
                    font-size: 14px;
                }
                `}
            </style>


            <Row className="justify-content-center m-0">
                <Col md={12} className="p-1">
                    <Card className="rounded-4 p-1 border-0"> {/* 그림자 제거 */}
                        {/* <Card.Title className="text-center mb-3 fs-5 fw-bold">
                            📆 스케줄 일정 관리
                        </Card.Title> */}
                        <Calendar
                            localizer={localizer}
                            events={[...events, ...checkEvents]}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 520 }}
                            step={15}
                            timeslots={4}
                            views={["month"]}
                            defaultView="month"
                            selectable
                            popup
                            culture="ko"
                            eventPropGetter={eventPropGetter}
                            dayPropGetter={dayPropGetter}
                            onSelectEvent={handleSelectEvent}
                            dayLayoutAlgorithm="no-overlap"
                            formats={{
                                eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
                                    const startTime = localizer.format(start, 'HH:mm');
                                    const endTime = localizer.format(end, 'HH:mm');
                                    return startTime === endTime ? startTime : `${startTime} - ${endTime}`
                                },
                                monthHeaderFormat: (date, culture, localizer) => {
                                    // 연도 먼저, 월 뒤
                                    return format(date, "yyyy년 MM월", { locale: ko });
                                },
                                dayHeaderFormat: (date, culture, localizer) => {
                                    return format(date, "yyyy년 MM월 dd일", { locale: ko });
                                },
                            }}
                            components={{
                                toolbar: CustomToolbar,
                                month: {
                                    dateHeader: ({ date }) => {
                                        const day = date.getDay();
                                        let color = "inherit";
                                        if (day === 0) color = "#dc3545";
                                        if (day === 6) color = "#0d6efd";
                                        return <div style={{ color, textAlign: "center", fontSize: "12px", fontWeight: "bold" }}>{date.getDate()}</div>
                                    }
                                },
                                week: {
                                    header: ({ date, label }) => {
                                        const day = date.getDay();
                                        let color = "inherit";
                                        if (day === 0) color = "#dc3545";
                                        if (day === 6) color = "#0d6efd";
                                        return <div style={{ color, textAlign: "center", fontSize: "12px", fontWeight: "bold" }}>{label}</div>
                                    }
                                }
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 이벤트 상세 Modal */}
            <Modal show={!!selectedEvent} onHide={() => setSelectedEvent(null)} centered size="lg">
                {selectedEvent && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                일정 상세보기 <Badge bg="secondary">{selectedEvent.category}</Badge>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p><strong>제목:</strong> {selectedEvent.title}</p>
                            {ETC_SCHEDULE_LIST.includes(selectedEvent.scheduleId) && (
                                <p><strong>근태 :</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
                            )}

                            {!ETC_SCHEDULE_LIST.includes(selectedEvent.scheduleId) && (
                                <>
                                    <p><strong>시작:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
                                    <p><strong>종료:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
                                    <p><strong>내용:</strong></p>
                                    <div style={{
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                        padding: "5px",
                                        border: "1px solid #dee2e6",
                                        borderRadius: "4px",
                                        whiteSpace: "pre-wrap"
                                    }}>
                                        <p>{selectedEvent.content}</p>
                                    </div>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setSelectedEvent(null)}>닫기</Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Container>
    );
}
