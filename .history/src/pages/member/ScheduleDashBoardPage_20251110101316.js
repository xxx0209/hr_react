import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Modal, Badge } from "react-bootstrap";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import ko from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
import { formatInTimeZone } from "date-fns-tz";
import axios from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import SelectCombo from "../../sample/SelectCombo";
import { ButtonGroup, IconButton, Tooltip, Button } from "@mui/material";
import { ArrowBackIos, ArrowBackIosNew, ArrowForwardIos, Today } from "@mui/icons-material"
import { ToggleButton, ToggleButtonGroup } from "@mui/material"

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
        if (!selectedMember) return alert("일정을 추가하려면 회원을 선택하세요.");
        setShowSlotModal(true);
    };

    const handleAddSlotEvent = async () => {
        if (!title || !slotStart || !slotEnd || !content) return alert("제목과 시간, 내용을 입력하세요");

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
        setContent("");
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
                //position: "relative",
                left: `${index * 10}%`, // ✅ 좌우 분리 (10%씩 밀기)
                width: `${100 - index * 10}%`, // ✅ 남은 폭 계산
                zIndex: 10 - index, // ✅ 겹칠 때 순서 보정
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transition: "all 0.2s ease-in-out",
            },
        };
    };

    const CustomToolbar = ({ date, onView, onNavigate, view }) => {
        const views = ["month", "week", "day"];

        // date는 현재 캘린더의 기준 날짜
        const labelText = format(date, "yyyy-MM"); // YYYY-MM 형식

        return (
            <>
                <Row className="align-items-center mb-3 gx-2 gy-1">
                    {/* 왼쪽: 캘린더 라벨 */}
                    <Col className="d-flex align-items-center">
                        <div
                            style={{
                                fontWeight: "bold",
                                fontSize: "1.4rem",
                                padding: "6px 14px",
                                borderRadius: "12px",
                                backgroundColor: "#f0f4f8",
                                color: "#1e88e5",
                                display: "inline-block",
                                minWidth: "100px",
                                textAlign: "center",
                            }}
                        >
                            {labelText}
                        </div>
                    </Col>

                    {/* 오른쪽: 회원 선택, 네비 버튼, 뷰 버튼 */}
                    <Col className="d-flex align-items-center justify-content-end">
                        {user.role === "ROLE_ADMIN" && (
                            <div style={{ minWidth: "150px", marginRight: "12px" }}>
                                <Form.Select
                                    size="sm"
                                    value={selectedMember || ""}
                                    onChange={e => setSelectedMember(e.target.value)}
                                    style={{ height: "34px" }} // 버튼과 동일 높이
                                >
                                    <option value="">회원 선택</option>
                                    {members.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </Form.Select>
                            </div>
                        )}
                        {/* 네비게이션 버튼 */}
                        <ButtonGroup
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                backgroundColor: "#f9fafb",
                                padding: "4px 8px",
                                borderRadius: "50px",
                                // boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            }}
                        >
                            <Tooltip title="이전">
                                <IconButton
                                    size="small"
                                    onClick={() => onNavigate("PREV")}
                                    sx={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e0e0e0",
                                        color: "#555",
                                        width: 36,
                                        height: 36,
                                        "&:hover": {
                                            backgroundColor: "#e3f2fd",
                                            color: "#1976d2",
                                            transform: "scale(1.05)",
                                        },
                                    }}
                                >
                                    <ArrowBackIosNew fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="오늘로 이동">
                                <IconButton
                                    size="small"
                                    onClick={() => onNavigate("TODAY")}
                                    sx={{
                                        background: "linear-gradient(135deg, #42a5f5, #1e88e5)",
                                        color: "white",
                                        width: 38,
                                        height: 38,
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #2196f3, #1976d2)",
                                            transform: "scale(1.08)",
                                        },
                                    }}
                                >
                                    <Today fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="다음">
                                <IconButton
                                    size="small"
                                    onClick={() => onNavigate("NEXT")}
                                    sx={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e0e0e0",
                                        color: "#555",
                                        width: 36,
                                        height: 36,
                                        "&:hover": {
                                            backgroundColor: "#e3f2fd",
                                            color: "#1976d2",
                                            transform: "scale(1.05)",
                                        },
                                    }}
                                >
                                    <ArrowForwardIos fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </ButtonGroup>

                        {/* 뷰 선택 버튼 */}
                        <ToggleButtonGroup
                            value={view}
                            exclusive
                            onChange={(e, newView) => {
                                if (newView) onView(newView);
                            }}
                            sx={{
                                backgroundColor: "#f9fafb",
                                borderRadius: "50px",
                                // boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                p: "4px",
                            }}
                        >
                            <ToggleButton
                                value="month"
                                sx={{
                                    px: 2.5,
                                    py: 0.8,
                                    borderRadius: "50px",
                                    fontSize: "0.9rem",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    whiteSpace: "nowrap",
                                    "&.Mui-selected": {
                                        background: "linear-gradient(135deg, #42a5f5, #1e88e5)",
                                        color: "white",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #2196f3, #1976d2)",
                                        },
                                    },
                                }}
                            >
                                월간
                            </ToggleButton>

                            <ToggleButton
                                value="week"
                                sx={{
                                    px: 2.5,
                                    py: 0.8,
                                    borderRadius: "50px",
                                    fontSize: "0.9rem",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    whiteSpace: "nowrap",
                                    "&.Mui-selected": {
                                        background: "linear-gradient(135deg, #42a5f5, #1e88e5)",
                                        color: "white",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #2196f3, #1976d2)",
                                        },
                                    },
                                }}
                            >
                                주간
                            </ToggleButton>

                            <ToggleButton
                                value="day"
                                sx={{
                                    px: 2.5,
                                    py: 0.8,
                                    borderRadius: "50px",
                                    fontSize: "0.9rem",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    whiteSpace: "nowrap",
                                    "&.Mui-selected": {
                                        background: "linear-gradient(135deg, #42a5f5, #1e88e5)",
                                        color: "white",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #2196f3, #1976d2)",
                                        },
                                    },
                                }}
                            >
                                일간
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row >
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
                    
                    
                    

                    

                    

                    
  


        

                    
                    
                `}
            </style>

            {/* 헤더 영역 */}
            <Row className="mb-3">
                <Col>
                    <h2>📆 스케줄 일정 관리</h2>
                </Col>
                <Col className="text-end">
                    {/* <Button
                        variant="outline-secondary"
                    //onClick={() => navigate(-1)}
                    >
                        목록으로
                    </Button> */}
                </Col>
            </Row>

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
                            views={["month", "week", "day"]}
                            defaultView="month"
                            selectable
                            popup
                            culture="ko"
                            eventPropGetter={eventPropGetter}
                            dayPropGetter={dayPropGetter}
                            onSelectEvent={handleSelectEvent}
                            onSelectSlot={handleSelectSlot}
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
        </Container>
    );
}
