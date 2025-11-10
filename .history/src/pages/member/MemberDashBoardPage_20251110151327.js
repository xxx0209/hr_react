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
import { Button as BasicButton } from "react-bootstrap";

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
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // ✅ 카테고리 + 회원 목록
    useEffect(() => {
        axios.get(`/categories`).then(res => setCategories(res.data));
        setSelectedMember(user.memberId);
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
            <Card className="dashboard-card text-center">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
                        alt="프로필"
                        className="rounded-circle mb-3"
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                    <h5>관리자</h5>
                    <p className="text-muted small mb-1">개발팀 / 과장</p>
                </Card.Body>
            </Card>
        </Container>
    );
}

