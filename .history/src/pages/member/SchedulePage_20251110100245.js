/* Two-week view 정의 — SchedulePage 파일 안에 직접 넣으세요 */
import { Navigate } from "react-big-calendar";
import { addDays, startOfWeek, format } from "date-fns";

/* 14일 범위 계산 (오늘이 포함되는 주의 시작에서 14일) */
const twoWeekRange = (date) => {
  const start = startOfWeek(date || new Date(), { weekStartsOn: 0 }); // 일요일 시작
  return Array.from({ length: 14 }, (_, i) => addDays(start, i));
};

/* 이전/다음/오늘 네비게이션 */
const twoWeekNavigate = (date, action) => {
  switch (action) {
    case Navigate.PREV: return addDays(date, -14);
    case Navigate.NEXT: return addDays(date, 14);
    case Navigate.TODAY: return new Date();
    default: return date;
  }
};

/* 툴바에 표시될 타이틀 문자열 */
const twoWeekTitle = (date, { localizer }) => {
  const r = twoWeekRange(date);
  const start = r[0];
  const end = r[r.length - 1];
  // 로컬라이저가 없으면 기본 format fallback
  try {
    return `${localizer.format(start, "MMM dd")} — ${localizer.format(end, "MMM dd")}`;
  } catch (e) {
    return `${format(start, "MMM dd")} — ${format(end, "MMM dd")}`;
  }
};

/* 렌더링 컴포넌트: 간단 안전 구현
   - 내부 TimeGrid import가 불안정하면, 이 컴포넌트가 fallback UI를 보여주도록 함.
   - 먼저 'react-big-calendar/lib/TimeGrid'를 사용하도록 시도(많은 사례에서 동작함).
*/
let InternalTimeGrid;
try {
  // 일부 빌드환경에서는 동작, 일부 환경에서는 undefined가 될 수 있음.
  // 이 줄이 에러나면 catch로 넘어갑니다.
  // eslint-disable-next-line import/no-extraneous-dependencies
  InternalTimeGrid = require('react-big-calendar/lib/TimeGrid').default;
} catch (err) {
  InternalTimeGrid = null;
}

const TwoWeekComponent = (props) => {
  const range = twoWeekRange(props.date || new Date());

  if (InternalTimeGrid) {
    // TimeGrid가 사용 가능하면 range prop으로 14일 전달
    return <InternalTimeGrid {...props} range={range} />;
  }

  // **Fallback**: TimeGrid를 가져올 수 없으면, 아주 간단한 메시지(디버그용)
  // 실제로는 여기서 직접 14일 그리드를 만들 수도 있지만 우선 동작확인이 목적
  return (
    <div style={{ padding: 20 }}>
      <strong>TwoWeek view fallback</strong>
      <div>range: {String(range[0])} — {String(range[range.length-1])}</div>
      <div style={{ marginTop: 8 }}>TimeGrid 모듈을 불러올 수 없어 기본 렌더가 불가합니다.</div>
    </div>
  );
};

/* 꼭 객체 형태로 export(또는 직접 Calendar에 넣기) */
const TwoWeekView = {
  range: twoWeekRange,
  navigate: twoWeekNavigate,
  title: twoWeekTitle,
  component: TwoWeekComponent,
};

/* --- 디버깅(중요) ---
   Calendar에 넘기기 직전에 아래 콘솔로 TwoWeekView의 형태를 확인하세요.
*/
console.log('TwoWeekView:', {
  isObject: typeof TwoWeekView === 'object',
  hasTitle: typeof TwoWeekView.title === 'function',
  hasRange: typeof TwoWeekView.range === 'function',
  hasNavigate: typeof TwoWeekView.navigate === 'function',
  componentType: typeof TwoWeekView.component,
});