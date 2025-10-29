import React, { useState, useEffect, useContext } from "react";
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


export default function SchedulePage() {
    const { user } = useContext(AuthContext);

    const [events, setEvents] = useState([
    {
        scheduleId: 1,
        title: "[회의] 팀 미팅",
        start: new Date("2025-10-29T09:00:00"),
        end: new Date("2025-10-29T10:00:00"),
        category: "회의",
        color: "#0d6efd",
        checkInTime: "2025-10-29T09:05:00",
        checkOutTime: "2025-10-29T09:55:00",
        memberId: 101
    },
    {
        scheduleId: 2,
        title: "[개발] 기능 구현",
        start: new Date("2025-10-29T10:30:00"),
        end: new Date("2025-10-29T12:00:00"),
        category: "개발",
        color: "#198754",
        checkInTime: null,
        checkOutTime: null,
        memberId: 101
    },
    {
        scheduleId: 3,
        title: "[점심] 점심 식사",
        start: new Date("2025-10-29T12:00:00"),
        end: new Date("2025-10-29T13:00:00"),
        category: "식사",
        color: "#ffc107",
        // checkInTime: null,
        // checkOutTime: null,
        memberId: 101
    }
    ]);

    // 출근/퇴근 이벤트만 별도
    const [checkEvents, setCheckEvents] = useState([
      {
        scheduleId: "checkin",
        title: "출근",
        start: new Date("2025-10-30T09:05:00"),
        end: new Date("2025-10-30T09:05:00"),
        color: "#0d6efd",
        isCheck: true
      },
      {
        scheduleId: "checkout",
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

    // ✅ 카테고리 + 회원 목록
    useEffect(() => {
        axios.get(`/categories`).then(res => setCategories(res.data));

        if (user.role === "ADMIN") {
            axios.get(`/members`).then(res => setMembers(res.data));
            setSelectedMember(null);
        } else {
            setSelectedMember(user.memberId);
        }
    }, [user]);

    // ✅ 일정 조회
    useEffect(() => {
        if (!selectedMember) return;

        axios.get(`/schedule/member/${selectedMember}`)
            .then(res => {
                const mapped = res.data.map(e => ({
                    ...e,
                    start: new Date(e.start),
                    end: new Date(e.end),
                }));
                //setEvents(mapped); 나중에 주석풀자 
            });
    }, [selectedMember]);

    const handleSelectEvent = (event) => setSelectedEvent(event);

    const handleSelectSlot = ({ start, end }) => {
        setSlotStart(start);
        setSlotEnd(end);
        setTitle("");
        setCategory(categories[0]?.name || "");
        setShowSlotModal(true);
    };

    const handleAddSlotEvent = async () => {
        if (!title || !slotStart || !slotEnd) return alert("제목과 시간을 입력하세요");

        const catObj = categories.find(c => c.name === category);
        const body = {
            title,
            categoryId: catObj.categoryId,
            start: formatInTimeZone(slotStart, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss"),
            end: formatInTimeZone(slotEnd, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss"),
            memberId: selectedMember
        };

        const res = await axios.post(`/schedule`, body);

        // 🔹 등록 직후 KST 기준으로 Date 변환
        setEvents([...events, {
            scheduleId: res.data.scheduleId,
            title: `[${category}] ${title}`,
            start: new Date(res.data.start),
            end: new Date(res.data.end),
            category,
            color: catObj.color,
            checkInTime: null,
            checkOutTime: null
        }]);
        setShowSlotModal(false);
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;
        if (!window.confirm("삭제 하시겠습니까?")) return;
        await axios.delete(`/schedule/${selectedEvent.scheduleId}`);
        setEvents(events.filter(e => e.scheduleId !== selectedEvent.scheduleId));
        setSelectedEvent(null);
    };

    // // 🔹 겹치는 이벤트 색상 반투명 + 좌우 분리
    const eventStyleGetter = (event) => ({
        
        style: {
            backgroundColor: event.color ? event.color + "80" : "#6c757d80",
            color: "white",
            borderRadius: "6px",
            border: "none",
            padding: "3px",
        },
        className: "",
        title : "이거 적용 안되나",
        test : "tttttttt"
    });
    // 이벤트 스타일
//   const eventStyleGetter = (event) => {
//     if(event.scheduleId === "checkin" || event.scheduleId === "checkout") {
//       return {
//           style:{
//             backgroundColor: event.color,
//             width: "100%",
//             height: "100%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "white",
//             fontSize: "0.8rem",
//             padding: 0
//           }
//         }
//     }
//     return {
//       style: {
//         backgroundColor: event.color || "#6c757d",
//         color: "white",
//         borderRadius: "6px",
//         padding: "4px"
//       }
//     }
//   }

    // const eventStyleGetter = (event) => {
    //     return { style: { height: "2px", backgroundColor: event.color } };

    // }

    const CustomToolbar = ({ label, onView, onNavigate, view }) => {
        const views = ["month", "week", "day"];

        return (
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
            {user.role === "ADMIN" &&
                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Select value={selectedMember || ""} onChange={e => setSelectedMember(e.target.value)}>
                            <option value="">회원 선택</option>
                            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </Form.Select>
                    </Col>
                </Row>
            }

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
                            eventPropGetter={eventStyleGetter}
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
            <Modal show={!!selectedEvent} onHide={() => setSelectedEvent(null)} centered>
                {selectedEvent && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                일정 상세보기 <Badge bg="secondary">{selectedEvent.category}</Badge>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p><strong>제목:</strong> {selectedEvent.title}</p>
                            <p><strong>시작:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
                            <p><strong>종료:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
                            {selectedEvent.checkInTime && <p>출근: {new Date(selectedEvent.checkInTime).toLocaleTimeString()}</p>}
                            {selectedEvent.checkOutTime && <p>퇴근: {new Date(selectedEvent.checkOutTime).toLocaleTimeString()}</p>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={handleDeleteEvent}>삭제</Button>
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
                            <Form.Label>카테고리</Form.Label>
                            <SelectCombo
                                label="카테고리"
                                options={categories}
                                value={category}
                                valueKey="categoryId"
                                labelKey="name"
                                onChange={(v) => setCategory(v)}
                                searchable={true}
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAddSlotEvent}>등록</Button>
                    <Button variant="secondary" onClick={() => setShowSlotModal(false)}>닫기</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
