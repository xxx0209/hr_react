import {
    AccessTime as AccessTimeIcon,
    Diversity1 as Diversity1Icon,
} from "@mui/icons-material";

const Attendance = [
    {
        id: 'attendance',
        label: "근태 관리",
        icon: <AccessTimeIcon sx={{ color: '#8AB8C4FF' }} />,
        baseToNo: 1,
        useSubs: true,
        subs: [
            {
                no: 1,
                label: "출퇴근 관리",
                to: "/attendance",
                icon: <AccessTimeIcon sx={{ color: '#6e3170ff' }} />,
                isAdminMenu: false,
                content: "출퇴근 관리 페이지 입니다.",
            },
        ],
    },
];

export const AttendanceMenu = Attendance;