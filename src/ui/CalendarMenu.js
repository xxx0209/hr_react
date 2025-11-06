import {
    CalendarMonth as CalendarMonthIcon,
    Diversity3 as Diversity3Icon,
    EditDocument as EditDocumentIcon,
    ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";

const calendar =
    [
        {
            id: 'calendar',
            icon: <CalendarMonthIcon sx={{ color: '#8b8c8dff' }} />,
            label: "캘린더",
            baseToNo: 1,
            subs: [
                {
                    no: 1,
                    label: "캘린더",
                    to: "/member/schedule",
                    icon: ManageAccountsIcon,
                    isAdminMenu: false,
                    content: "개인 일정/출퇴근현황/휴가 일정을 확인할 수 있는 메뉴입니다."
                },
            ]

        }
    ];

export const CalendarMenu = calendar;