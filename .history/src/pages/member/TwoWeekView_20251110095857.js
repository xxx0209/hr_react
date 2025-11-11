import React from "react";
import { Navigate } from "react-big-calendar";
import { addDays, startOfWeek } from "date-fns";
import TimeGrid from "react-big-calendar/lib/TimeGrid";

// 1️⃣ 2주(14일) 날짜 범위 계산
function twoWeekRange(date) {
    const start = startOfWeek(date, { weekStartsOn: 0 }); // 일요일 기준
    return Array.from({ length: 14 }, (_, i) => addDays(start, i));
}

// 2️⃣ 이전/다음/오늘 이동 로직
function twoWeekNavigate(date, action) {
    switch (action) {
        case Navigate.PREV:
            return addDays(date, -14);
        case Navigate.NEXT:
            return addDays(date, 14);
        case Navigate.TODAY:
            return new Date();
        default:
            return date;
    }
}

// 3️⃣ 툴바 타이틀 표시
function twoWeekTitle(date, { localizer }) {
    const [start, end] = [twoWeekRange(date)[0], twoWeekRange(date).slice(-1)[0]];
    return `${localizer.format(start, "MMM dd")} — ${localizer.format(end, "MMM dd")}`;
}

// 4️⃣ 실제 렌더링할 컴포넌트 (TimeGrid를 14일로 확장)
function TwoWeekComponent({ date, localizer, ...props }) {
    const range = twoWeekRange(date);
    return <TimeGrid {...props} range={range} eventOffset={15} localizer={localizer} />;
}

// 5️⃣ react-big-calendar에서 요구하는 View 객체 형태로 export
const TwoWeekView = {
    range: twoWeekRange,
    navigate: twoWeekNavigate,
    title: twoWeekTitle,
    component: TwoWeekComponent,
};

export default TwoWeekView;