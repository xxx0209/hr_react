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
        baseToNo: 1,
        useSubs: true,
        subs: [
            {
                no: 1,
                label: "출석 현황",
                to: "/attendance/tracker",
                icon: AccessTimeIcon,
                isAdminMenu: false,
                content: "출근 기록 페이지입니다.",
            },
            {
                no: 2,
                label: "대쉬보드",
                icon: Diversity1Icon,
                to: "attendance/dashboard",
                isAdminMenu: false,
                content: "대쉬보드입니다. 관리 페이지입니다.",
            },
        ],
    },
];

export default AttendanceMenu;