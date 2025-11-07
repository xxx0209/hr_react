import {
    Diversity3 as Diversity3Icon,
    EditDocument as EditDocumentIcon,
    ManageAccounts as ManageAccountsIcon,
    AccessTime as AccessTimeIcon,
} from "@mui/icons-material";

const attendance =
    [
        {
            id: 'attendance',
            icon: <AccessTimeIcon sx={{ color: '#8b8c8dff' }} />,
            label: "근태관리",
            baseToNo: 1,
            useSubs: true,
            subs: [
                {
                    no: 1,
                    label: "출퇴근",
                    to: "/attendance/attendance",
                    icon: ManageAccountsIcon,
                    isAdminMenu: false,
                    content: "출퇴근 관리 화면 입니다."
                },
                {
                    no: 2,
                    label: "출퇴근 기능 테스트",
                    to: "/attendance/attendance",
                    icon: Diversity3Icon,
                    isAdminMenu: false,
                    content: "출퇴근 기능 관리합니다."
                },
                {
                    no: 3,
                    label: "휴가 현황 테스트",
                    to: "/attendance/leave",
                    icon: EditDocumentIcon,
                    isAdminMenu: false,
                    content: "휴가 현황을 확인할 수 있는 메뉴입니다."
                },
            ]
        }
    ];

export const AttendanceMenu = attendance;