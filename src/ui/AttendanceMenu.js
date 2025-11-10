import {
    AccessTime as AccessTimeIcon,
    EditDocument as EditDocumentIcon,
    Diversity1 as Diversity1Icon,
} from "@mui/icons-material";

const AttendanceMenu = [
    {
        id: 'attendance',
        label: "근태 관리",
        icon: <AccessTimeIcon sx={{ color: '#8AB8C4FF' }} />,
        to: "/attendance",
        subs: [
            {
                id: "attendance1",
                label: "출근 기록",
                icon: <AccessTimeIcon />,
                to: "/attendance/tracker",
                isAdminMenu: false,
                content: "출근 기록 페이지입니다.",
            },
            {
                id: "attendance2",
                label: "근태 신청",
                icon: <EditDocumentIcon />,
                to: "/attendance/leave",
                isAdminMenu: false,
                content: "근태 신청을 합니다.",
            },
            {
                id: "attendance3",
                label: "연차 관리",
                icon: <Diversity1Icon />,
                to: "/attendance/leave",
                isAdminMenu: false,
                content: "연차 관리 페이지입니다.",
            },
        ],
    },
];

export default AttendanceMenu;