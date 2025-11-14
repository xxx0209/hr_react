import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Modal, Badge } from "react-bootstrap";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, endOfWeek, getDay, addDays, addMonths } from "date-fns";
import ko from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
import { formatInTimeZone } from "date-fns-tz";
import axios from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import SelectCombo from "../../sample/SelectCombo";
import { ButtonGroup, IconButton, Tooltip, Button } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos, Today } from "@mui/icons-material"
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
    const [checkEvents, setCheckEvents] = useState([]);

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

    const [currentDate, setCurrentDate] = useState(new Date()); //현재 달

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
        if (!selectedMember || !currentDate) return;

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");

        axios.get(`/schedule/member/${selectedMember}?month=${year}-${month}`)
            .then(res => {
                const sMapped = res.data.scheduleDtoList.map(e => ({
                    ...e,
                    start: new Date(e.start),
                    end: new Date(e.end),
                }));
                setEvents(sMapped);
                const rMapped = res.data.requestDtoList.map(e => ({
                    ...e,
                    start: new Date(e.start),
                    end: new Date(e.end),
                    color: '#dc3545' // 휴가의 컬러색 고정
                }));
                setCheckEvents(rMapped);
            });
    }, [selectedMember, currentDate]);

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

        const labelText = (() => {
            if (view === "month") {
                // 📅 월간 뷰 → "2025년 11월"
                return format(date, "yyyy년 MM월", { locale: ko });
            } else if (view === "week") {
                // 📆 주간 뷰 → "2025.11.03 ~ 2025.11.09"
                const start = startOfWeek(date, { weekStartsOn: 0 }); // 월요일 시작
                const end = endOfWeek(date, { weekStartsOn: 0 });
                return `${format(start, "yyyy.MM.dd")} ~ ${format(end, "MM.dd")}`;
            } else if (view === "day") {
                // 🗓️ 일간 뷰 → "2025.11.11 (화)"
                return format(date, "yyyy.MM.dd (EEE)", { locale: ko });
            } else {
                return format(date, "yyyy-MM-dd"); // 기본값
            }
        })();

        const handleNavigate = (action) => {
            let newDate = new Date(date);

            if (action === "TODAY") {
                newDate = new Date();
            } else if (action === "PREV") {
                if (view === "month") newDate = addMonths(newDate, -1);   // 월 단위
                else if (view === "week") newDate = addDays(newDate, -7); // 주 단위
                else if (view === "day") newDate = addDays(newDate, -1);  // 일 단위
            } else if (action === "NEXT") {
                if (view === "month") newDate = addMonths(newDate, 1);
                else if (view === "week") newDate = addDays(newDate, 7);
                else if (view === "day") newDate = addDays(newDate, 1);
            }

            onNavigate(action);
            setCurrentDate(newDate); // ✅ 여기 추가
        };

        return (
            <>
                <Row className="align-items-center mb-3 gx-2 gy-1">
                    {/* 왼쪽: 캘린더 라벨 */}
                    <Col className="d-flex align-items-center">
                        <div
                            style={{
                                fontWeight: "bold",
                                fontSize: "1.2rem", // 1.4rem → 1.2rem
                                padding: "4px 10px", // padding 줄임
                                borderRadius: "10px",
                                backgroundColor: "#f0f4f8",
                                color: "#1e88e5",
                                display: "inline-block",
                                minWidth: "80px",   // 작게
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
                                    style={{ height: "32px", fontSize: "0.85rem" }} // 높이와 글자 크기 줄임
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
                                    onClick={() => handleNavigate("PREV")}
                                    sx={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e0e0e0",
                                        color: "#555",
                                        width: 30,      // 36 → 30
                                        height: 30,     // 36 → 30
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
                                    onClick={() => handleNavigate("TODAY")}
                                    sx={{
                                        background: "linear-gradient(135deg, #42a5f5, #1e88e5)",
                                        color: "white",
                                        width: 30,      // 36 → 30
                                        height: 30,     // 36 → 30
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
                                    onClick={() => handleNavigate("NEXT")}
                                    sx={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e0e0e0",
                                        color: "#555",
                                        width: 30,      // 36 → 30
                                        height: 30,     // 36 → 30
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
                                p: "3px",
                            }}
                        >
                            <ToggleButton
                                value="month"
                                sx={{
                                    px: 1.0,          // 2.5 → 1.5
                                    py: 0.4,          // 0.8 → 0.5
                                    fontSize: "0.8rem", // 0.9rem → 0.8rem
                                    borderRadius: "50px",
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
                                    px: 1.0,          // 2.5 → 1.5
                                    py: 0.4,          // 0.8 → 0.5
                                    fontSize: "0.8rem", // 0.9rem → 0.8rem
                                    borderRadius: "50px",
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
                                    px: 1.0,          // 2.5 → 1.5
                                    py: 0.4,          // 0.8 → 0.5
                                    fontSize: "0.8rem", // 0.9rem → 0.8rem
                                    borderRadius: "50px",
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
                    .rbc-event-content,
                    .rbc-event-label {
                        flex: 1;
                        font-size: 11px;
                        font-family: 'Inter', sans-serif;
                        font-variant-numeric: tabular-nums;
                        line-height: 1;
                        margin: 0;
                    }
                    /* 시간 컬럼 글꼴, 크기 변경 */
                    .rbc-time-gutter .rbc-label {
                        font-family: 'Inter', sans-serif;
                        font-size: 11px;
                        color: #555; /* 원하는 색상 */
                    }

                    /* 타임 슬롯 안 글꼴, 크기 변경 */
                    .rbc-timeslot-group {
                        font-family: 'Inter', sans-serif;
                        font-size: 11px;
                        color: #333;
                    }

                    /* 이벤트 제목 글꼴, 크기 변경 */
                    .rbc-event-content {
                        font-family: 'Inter', sans-serif;
                        font-size: 11px;
                        font-weight: 500;
                    }

                    /* 이벤트 시간 표시 (선택사항) */
                    .rbc-event-label {
                        font-family: 'Inter', sans-serif;
                        font-size: 12px;
                        color: #fff;
                    }
                    /* 월간 뷰 요일 글자색 */
                    .rbc-header {
                        font-family: 'Inter', sans-serif;
                        font-size: 12px;
                        font-weight: 600;
                    }

                    /* 일요일 빨강 */
                    .rbc-header:nth-child(1) {
                        color: #dc3545;
                    }

                    /* 토요일 파랑 */
                    .rbc-header:nth-child(7) {
                        color: #0d6efd;
                    }
                    /* 월간뷰 요일 헤더 높이 */
                    .rbc-month-header {
                      height: 40px !important; /* 원하는 높이로 조정 (기본은 약 25~30px) */
                    }

                    .rbc-month-header .rbc-header {
                      line-height: 40px !important; /* 텍스트 수직 정렬 맞추기 */
                      font-size: 12px; /* 글자 크기도 함께 조정 가능 */
                    }
                    /* 📅 주간 뷰(week view) 요일 헤더 높이 */
                    .rbc-time-header {
                      height: 60px !important; /* 전체 헤더 영역 높이 */
                    }
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
                            date={currentDate} // ✅ 현재 달 유지
                            onNavigate={(newDate) => setCurrentDate(newDate)} // ✅ react-big-calendar 기본 네비게이션도 반영
                            localizer={localizer}
                            events={[...events, ...checkEvents]}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100vh' }}
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
            <Modal
                show={!!selectedEvent}
                onHide={() => setSelectedEvent(null)}
                centered
                size="lg"
            >
                {selectedEvent && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                일정 상세보기{" "}
                                <Badge bg="secondary">{selectedEvent.category}</Badge>
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form>

                                {/* 제목 */}
                                <Form.Group className="mb-3">
                                    <Form.Label><strong>제목</strong></Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedEvent.title}
                                        disabled
                                    />
                                </Form.Group>

                                {/* 근태 일정 */}
                                {ETC_SCHEDULE_LIST.includes(selectedEvent.scheduleId) && (
                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>근태</strong></Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={new Date(selectedEvent.end).toLocaleString()}
                                            disabled
                                        />
                                    </Form.Group>
                                )}

                                {/* 일반 일정 */}
                                {!ETC_SCHEDULE_LIST.includes(selectedEvent.scheduleId) && (
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label><strong>시작</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={new Date(selectedEvent.start).toLocaleString()}
                                                disabled
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label><strong>종료</strong></Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={new Date(selectedEvent.end).toLocaleString()}
                                                disabled
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label><strong>내용</strong></Form.Label>
                                            <div
                                                style={{
                                                    minHeight: "200px",      // 최소 높이
                                                    maxHeight: "200px",      // 최대 높이
                                                    overflowY: "auto",
                                                    padding: "10px",
                                                    fontSize: "12px",
                                                    border: "1px solid #dee2e6",
                                                    borderRadius: "4px",
                                                    whiteSpace: "pre-wrap",
                                                    background: "#fafafa"
                                                }}
                                            >
                                                {selectedEvent.content}
                                            </div>
                                        </Form.Group>
                                    </>
                                )}

                            </Form>
                        </Modal.Body>

                        <Modal.Footer>
                            {selectedEvent?.scheduleId && (
                                <Button variant="danger" onClick={handleDeleteEvent}>
                                    삭제
                                </Button>
                            )}
                            <Button
                                variant="secondary"
                                onClick={() => setSelectedEvent(null)}
                            >
                                닫기
                            </Button>
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
                            <Form.Label style={{ marginRight: '10px' }}>시작 시간</Form.Label>
                            <DatePicker
                                selected={slotStart}
                                onChange={setSlotStart}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="yyyy-MM-dd HH:mm"
                                className="form-control"
                                dayClassName={date => {
                                    const day = date.getDay();
                                    if (day === 0) return "sunday"; // 일요일
                                    if (day === 6) return "saturday"; // 토요일
                                    return undefined;
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ marginRight: '10px' }}>종료 시간</Form.Label>
                            <DatePicker
                                selected={slotEnd}
                                onChange={setSlotEnd}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="yyyy-MM-dd HH:mm"
                                className="form-control"
                                dayClassName={date => {
                                    const day = date.getDay();
                                    if (day === 0) return "sunday"; // 일요일
                                    if (day === 6) return "saturday"; // 토요일
                                    return undefined;
                                }}
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
