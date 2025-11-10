import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaCalendarCheck,
} from "react-icons/fa";
import { Container, Row, Col, Card, Form, Button, Modal, Badge, ButtonGroup } from "react-bootstrap";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ko from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
import { formatInTimeZone } from "date-fns-tz";
import axios from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import SelectCombo from "../../sample/SelectCombo";

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

function ScheduleDashBoardPage() {

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
                // position: "relative",
                left: `${index * 10}%`, // ✅ 좌우 분리 (10%씩 밀기)
                width: `${100 - index * 10}%`, // ✅ 남은 폭 계산
                zIndex: 10 - index, // ✅ 겹칠 때 순서 보정
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transition: "all 0.2s ease-in-out",
            },
        };
    };

    const navigate = useNavigate();
    return (

        < Card className="" style={{
            width: "100%",        // ✅ 가로 100%
            height: "60vh",       // 높이도 필요하면 지정
            overflow: "hidden",   // 혹시 넘치는 부분 잘라줌
        }}>
            {/* <Card.Body className="d-flex flex-column align-items-center justify-content-center"> */}
            <div style={{ height: "100%", padding: "10px" }}>
                <Calendar
                    localizer={localizer}
                    events={[...events, ...checkEvents]}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 520 }}
                    step={15}
                    timeslots={4}
                    views={["month", "week", "day"]}
                    defaultView="week"
                    selectable
                    popup
                    culture="ko"
                    eventPropGetter={eventPropGetter}
                    // dayPropGetter={dayPropGetter}
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
            </div>
            {/* </ Card.Body> */}
        </Card >
    );
}

export default ScheduleDashBoardPage;