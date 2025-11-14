import {
    People as PeopleIcon,
    Diversity3 as Diversity3Icon,
    EditDocument as EditDocumentIcon,
    ManageAccounts as ManageAccountsIcon
} from "@mui/icons-material";

const member =
    [
        {
            id: 'member',
            icon: <PeopleIcon sx={{ color: '#8b8c8dff' }} />,
            label: "직원관리",
            baseToNo: 1,
            useSubs: true,
            subs: [
                {
                    no: 1,
                    label: "직원정보 수정",
                    to: "/member/update",
                    icon: <ManageAccountsIcon sx={{ color: '#6e3170ff' }} />,
                    isAdminMenu: false,
                    content: "회원의 기본 정보를 수정할수 있는 메뉴 입니다.\r\n이름, 비밀번호, 이메일, 프로필 사진 등을 변경할 수 있습니다."
                },
                {
                    no: 2,
                    label: "직급체계 관리",
                    to: ["/member/position/list", "/member/position", "/member/position/:id"],
                    icon: <Diversity3Icon sx={{ color: '#6e3170ff' }} />,
                    isAdminMenu: true,
                    content: "회사의 직급체계를 관리합니다.\r\n직급을 추가, 수정, 삭제할 수 있습니다.\r\n"
                },
                {
                    no: 3,
                    label: "진급 관리",
                    to: ["/member/position/history/list", "/member/position/history/save"],
                    icon: <EditDocumentIcon sx={{ color: '#6e3170ff' }} />,
                    isAdminMenu: true,
                    content: "직원의 진급 내역을 확인합니다.\r\n직원의 직급을 변경할 수 있습니다.\r\n"
                },
            ]
        }
    ];

export const MemberMenu = member;