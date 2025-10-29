import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Button, Modal, Badge } from "react-bootstrap";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ko from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
import axios from "../../api/api";
import { AuthContext } from "../../context/AuthContext"; // 🔹 기존 auth context

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

    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [members, setMembers] = useState([]); // 🔹 추가: 관리자 회원 목록
    const [selectedMember, setSelectedMember] = useState(null); // 🔹 수정: 일반 사용자를 위해 null 초기화
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [showSlotModal, setShowSlotModal] = useState(false);
    const [slotStart, setSlotStart] = useState(null);
    const [slotEnd, setSlotEnd] = useState(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");

    // 🔹 수정: 카테고리 + 회원 목록 + selectedMember 초기화
    useEffect(() => {
        // 카테고리 불러오기
        axios.get(`/categories`).then(res => setCategories(res.data));

        if (user.role === "ADMIN") {
            // 관리자: 회원 목록 가져오기
            axios.get(`/members`).then(res => setMembers(res.data));
            setSelectedMember(null); // 초기값 null, 드롭다운 선택 가능
        } else {
            // 일반 회원: 자기 자신으로 자동 설정
            setSelectedMember(user.memberId); // 🔹 추가
        }
    }, [user]);

    // 🔹 수정: selectedMember 변경 시 일정 조회
    useEffect(() => {
        if (!selectedMember) return;

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
        setCategory(categories[0]?.name || "");
        setShowSlotModal(true);
    };

    const handleAddSlotEvent = async () => {
        if (!title || !slotStart || !slotEnd) return alert("제목과 시간을 입력하세요");

        const catObj = categories.find(c => c.name === category);
        const body = {
            title,
            categoryId: catObj.categoryId,
            start: slotStart,
            end: slotEnd,
            memberId: selectedMember // 🔹 추가: 선택된 회원 ID 포함
        };

        const res = await axios.post(`/schedule`, body);
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
        console.log(events)
        setShowSlotModal(false);
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;
        if (!window.confirm("정말 삭제?")) return;
        await axios.delete(`/schedule/${selectedEvent.scheduleId}`);
        setEvents(events.filter(e => e.scheduleId !== selectedEvent.scheduleId));
        setSelectedEvent(null);
    };

    const eventStyleGetter = (event) => ({
        style: {
            backgroundColor: event.color || "#6c757d",
            color: "white",
            borderRadius: "6px",
            border: "none",
            padding: "4px",
        }
    });

    return (
        <Container fluid className="p-5 bg-light min-vh-100">
            {/* 🔹 수정: 관리자만 회원 선택 */}
            {user.role === "ADMIN" &&
                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Select value={selectedMember || ""} onChange={e => setSelectedMember(e.target.value)}>
                            <option value="">회원 선택</option> {/* 🔹 추가: 초기 선택 안내 */}
                            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </Form.Select>
                    </Col>
                </Row>
            }

            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="shadow rounded-4 p-3">
                        <Card.Title className="text-center mb-3 fs-5 fw-bold">
                            📆 시간 선택 가능 달력
                        </Card.Title>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 750 }}
                            step={15}
                            timeslots={4}
                            views={["month", "week", "day"]}
                            defaultView="week"
                            selectable
                            popup
                            culture="ko"
                            eventPropGetter={eventStyleGetter}
                            onSelectEvent={handleSelectEvent}
                            onSelectSlot={handleSelectSlot}
                            components={{
                                // 🔹 수정: 출퇴근 시간 표시
                                event: ({ event }) => (
                                    <div>
                                        <strong>{event.title}</strong>
                                        {event.checkInTime && <div>출근: {new Date(event.checkInTime).toLocaleTimeString()}</div>}
                                        {event.checkOutTime && <div>퇴근: {new Date(event.checkOutTime).toLocaleTimeString()}</div>}
                                    </div>
                                ),
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
                            <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
                                {categories.map(c => <option key={c.categoryId} value={c.name}>{c.name}</option>)}
                            </Form.Select>
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
