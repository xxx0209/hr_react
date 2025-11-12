import {
    CalendarMonth as CalendarMonthIcon,
    Category as CategoryIcon
} from "@mui/icons-material";
const calendar =
    [
        {
            id: 'calendar',
            icon: <CalendarMonthIcon sx={{ color: '#8b8c8dff' }} />,
            label: "캘린더",
            baseToNo: 1,
            useSubs: true,
            subs: [
                {
                    no: 1,
                    label: "캘린더",
                    to: "/schedule/schedule",
                    icon: <CalendarMonthIcon sx={{ color: '#097ff5ff' }} />,
                    isAdminMenu: false,
                    content: "개인 일정을 관리 합니다.\r\n개인일정/출퇴근현황/휴가 일정을 확인할 수 있습니다."
                },
                {
                    no: 2,
                    label: "캘린더 카테고리 등록",
                    to: "/schedule/category",
                    icon: <CategoryIcon sx={{ color: '#097ff5ff' }} />,
                    isAdminMenu: true,
                    content: "캘린더의 카테고리를 등록합니다.\r\n카테고리별 색상을 지정할수 있습니다."
                },
            ]

        }
    ];

export const CalendarMenu = calendar;