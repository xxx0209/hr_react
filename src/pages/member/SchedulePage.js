import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Button, Modal, Badge, ButtonGroup } from "react-bootstrap";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ko from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
import { formatInTimeZone } from "date-fns-tz";
import axios from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import SelectCombo from "../../sample/SelectCombo";
// import styled from "styled-components";

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
    const { user } = useContext(AuthContext);

    const [events, setEvents] = useState([]);

    // 출근/퇴근 이벤트만 별도
    const [checkEvents, setCheckEvents] = useState([
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

    const [categories, setCategories] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [showSlotModal, setShowSlotModal] = useState(false);
    const [slotStart, setSlotStart] = useState(null);
    const [slotEnd, setSlotEnd] = useState(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");

    // ✅ 카테고리 + 회원 목록
    useEffect(() => {
        axios.get(`/categories`).then(res => setCategories(res.data));

        if (user.role === "ROLE_ADMIN") {
            setSelectedMember(user.memberId);
            axios.get(`/member/list`).then(res => setMembers(res.data));
            //setSelectedMember(null);
        } else {
            setSelectedMember(user.memberId);
        }
    }, [user]);

    // ✅ 일정 조회
    useEffect(() => {
        if (!selectedMember) return;
        console.log("선택된 회원:", selectedMember);
        axios.get(`/schedule/member/${selectedMember}`)
            .then(res => {
                const mapped = res.data.map(e => ({
                    ...e,
                    start: new Date(e.start),
                    end: new Date(e.end),
                }));
                setEvents(mapped);
            });
    }, [selectedMember]);

    const handleSelectEvent = (event) => setSelectedEvent(event);

    const handleSelectSlot = ({ start, end }) => {
        setSlotStart(start);
        setSlotEnd(end);
        setTitle("");
        setCategory(categories[0]?.categoryId || "");
        setContent("");
        if (!selectedMember) {
            return alert("일정을 추가하려면 회원을 선택하세요.");
        }
        setShowSlotModal(true);
    };

    const handleAddSlotEvent = async () => {
        if (!title || !slotStart || !slotEnd || !content) return alert("제목과 시간 그리고 내용을 입력하세요");

        const catObj = categories.find(c => c.categoryId === category);
        const body = {
            title,
            categoryId: catObj.categoryId,
            content,
            start: formatInTimeZone(slotStart, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss"),
            end: formatInTimeZone(slotEnd, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss"),
            memberId: selectedMember
        };

        const res = await axios.post(`/schedule`, body);

        // 🔹 등록 직후 KST 기준으로 Date 변환
        setEvents([...events, {
            scheduleId: res.data.scheduleId,
            title: "[" + categories.find(c => c.categoryId === category)?.name + "] " + title,
            content,
            start: new Date(res.data.start),
            end: new Date(res.data.end),
            category,
            color: catObj.color,
            checkInTime: null,
            checkOutTime: null
        }]);

        setTitle("");
        setCategory(categories[0]?.categoryId || "");
        setSlotStart(null);
        setSlotEnd(null);
        setContent(""); // 초기화
        setShowSlotModal(false);
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;
        if (!window.confirm("삭제 하시겠습니까?")) return;
        await axios.delete(`/schedule/${selectedEvent.scheduleId}`);
        setEvents(events.filter(e => e.scheduleId !== selectedEvent.scheduleId));
        setSelectedEvent(null);
    };

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
                position: "relative",
                left: `${index * 10}%`, // ✅ 좌우 분리 (10%씩 밀기)
                width: `${100 - index * 10}%`, // ✅ 남은 폭 계산
                zIndex: 10 - index, // ✅ 겹칠 때 순서 보정
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transition: "all 0.2s ease-in-out",
            },
        };
    };

    const CustomToolbar = ({ label, onView, onNavigate, view }) => {
        const views = ["month", "week", "day"];

        return (
            <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    {/* 이전 / 오늘 / 다음 버튼 */}
                    <div>
                        <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => onNavigate("PREV")}>◀</Button>
                        <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => onNavigate("TODAY")}>오늘</Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => onNavigate("NEXT")}>▶</Button>
                    </div>

                    {/* 현재 월/연도 표시 */}
                    <div style={{ fontWeight: "bold", fontSize: "1.3rem" }}>
                        {label}
                        {/* {format(new Date(label), "yyyy년 MM월", { locale: ko })} */}
                    </div>

                    {/* 뷰 선택 버튼 */}
                    <ButtonGroup>
                        {views.map(v => (
                            <Button
                                key={v}
                                size="sm"
                                variant={view === v ? "primary" : "outline-primary"} // 클릭된 뷰 색상 표시
                                onClick={() => onView(v)}
                            >
                                {v === "month" ? "월간" : v === "week" ? "주간" : "일간"}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>
                {user.role === "ROLE_ADMIN" &&
                    <div className="mb-3">
                        <Form.Select value={selectedMember || ""} onChange={e => setSelectedMember(e.target.value)}>
                            <option value="">회원 선택</option>
                            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </Form.Select>
                    </div>
                }
            </>

        );
    };

    return (
        <Container fluid className="p-5 bg-light min-vh-100">
            {/* 페이지 전용 CSS */}
            <style>
                {`
                .rbc-event-content,
                .rbc-event-label {
                flex: 1;
                font-size: 14px;
                font-family: 'Inter', sans-serif;
                font-variant-numeric: tabular-nums;  
                line-height: 1;           /* 세로 균일 */ 
                margin: 0;
              }
            `}
            </style>
            {/* {user.role === "ROLE_ADMIN" &&
                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Select value={selectedMember || ""} onChange={e => setSelectedMember(e.target.value)}>
                            <option value="">회원 선택</option>
                            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </Form.Select>
                    </Col>
                </Row>
            } */}

            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="shadow rounded-4 p-3">
                        <Card.Title className="text-center mb-3 fs-5 fw-bold">
                            📆 스케줄 일정 관리
                        </Card.Title>
                        <Calendar
                            localizer={localizer}
                            events={[...events, ...checkEvents]}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 750 }}
                            step={15}
                            timeslots={4}
                            views={["month", "week", "day"]}
                            defaultView="month"
                            selectable
                            popup
                            culture="ko"
                            eventPropGetter={eventPropGetter}
                            onSelectEvent={handleSelectEvent}
                            onSelectSlot={handleSelectSlot}
                            dayLayoutAlgorithm="no-overlap"
                            eventTimeRangeFormat={({ start, end }, culture, localizer) => {
                                return "dfdfdfd"
                            }}
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
                                //                             event: ({ event }) => {
                                // //   // 출근/퇴근 이벤트면 start 시간만 표시
                                // //   if(event.scheduleId === "checkin" || event.scheduleId === "checkout") {
                                // //     return (
                                // //       <div style={{textAlign:"center", width:"100%", color:"white", fontSize:"0.8rem"}}>
                                // //     {event.start.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                                // //   </div>
                                // //     )
                                // //   }
                                //   // 일반 일정
                                //   return (

                                //       <div>
                                //   <div className="rbc-event-content" title={event.title}>
                                //     <span className="rbc-event-label">
                                //       {event.title}
                                //     </span>
                                //   </div>
                                // </div>

                                //   )
                                // },
                                month: {
                                    dateHeader: ({ date }) => {
                                        const day = date.getDay();
                                        let color = "inherit";
                                        if (day === 0) color = "#dc3545";
                                        if (day === 6) color = "#0d6efd";
                                        return <div style={{ color, textAlign: "center", fontWeight: "bold" }}>{date.getDate()}</div>
                                    }
                                },
                                week: {
                                    header: ({ date, label }) => {
                                        const day = date.getDay();
                                        let color = "inherit";
                                        if (day === 0) color = "#dc3545";
                                        if (day === 6) color = "#0d6efd";
                                        return <div style={{ color, textAlign: "center", fontWeight: "bold" }}>{label}</div>
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
                        <Modal.Body >
                            <p><strong>제목:</strong> {selectedEvent.title}</p>
                            {ETC_SCHEDULE_LIST.includes(selectedEvent.scheduleId) && (
                                <p><strong>근태 :</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
                            )}

                            {!ETC_SCHEDULE_LIST.includes(selectedEvent.scheduleId) && (
                                <>
                                    <p><strong>시작:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
                                    <p><strong>종료:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
                                    <p><strong>내용:</strong></p>
                                    {/* 스크롤 영역: 내용 */}
                                    <div style={{
                                        maxHeight: "200px",   // 높이 제한
                                        overflowY: "auto",    // 세로 스크롤
                                        padding: "5px",
                                        border: "1px solid #dee2e6",
                                        borderRadius: "4px",
                                        whiteSpace: "pre-wrap" // 엔터키 줄바꿈 적용
                                    }} >
                                        <p>{selectedEvent.content}</p>
                                    </div>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            {!ETC_SCHEDULE_LIST.includes(selectedEvent.scheduleId) && (
                                <Button variant="danger" onClick={handleDeleteEvent}>삭제</Button>
                            )}
                            <Button variant="secondary" onClick={() => setSelectedEvent(null)}>닫기</Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>

            {/* 일정 등록 Modal */}
            <Modal show={showSlotModal} onHide={() => setShowSlotModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>새 일정 등록</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>제목</Form.Label>
                            <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <SelectCombo
                                label="카테고리"
                                options={categories}
                                value={category}
                                valueKey="categoryId"
                                labelKey="name"
                                onChange={(v) => setCategory(v)}
                                searchable={false}
                                required={true}
                            />
                            {/* <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
                                {categories.map(c => <option key={c.categoryId} value={c.name}>{c.name}</option>)}
                            </Form.Select> */}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>시작 시간</Form.Label>
                            <DatePicker
                                selected={slotStart}
                                onChange={setSlotStart}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="yyyy-MM-dd HH:mm"
                                className="form-control"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>종료 시간</Form.Label>
                            <DatePicker
                                selected={slotEnd}
                                onChange={setSlotEnd}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="yyyy-MM-dd HH:mm"
                                className="form-control"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>내용</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="일정 내용을 입력하세요"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAddSlotEvent}>등록</Button>
                    <Button variant="secondary" onClick={() => setShowSlotModal(false)}>닫기</Button>
                </Modal.Footer>
            </Modal>
        </Container >
    );
}
