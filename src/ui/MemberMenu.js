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
            label: "회원관리",
            baseToNo: 2,
            subs: [
                {
                    no: 1,
                    label: "회원정보 수정",
                    to: "/member/profile/edit",
                    icon: ManageAccountsIcon,
                    isAdminMenu: false,
                    content: "회원의 기본 정보를 수정할수 있는 메뉴 입니다.\r\n  아이디, 비밀번호, 이메일, 프로필 사진 등을 변경할 수 있습니다."
                },
                {
                    no: 2,
                    label: "직급등록",
                    to: "/member/position",
                    icon: Diversity3Icon,
                    isAdminMenu: false,
                    content: "회사의 직급체계를 관리합니다.\r\n  관리자는 직급을 추가, 수정, 삭제할 수 있습니다."
                },
                {
                    no: 3,
                    label: "직급리스트",
                    to: "/member/position/list",
                    icon: Diversity3Icon,
                    isAdminMenu: false,
                    content: "직급 내역을 조회합니다."
                },
                {
                    no: 4,
                    label: "직급내역리스트",
                    to: "/member/position/history/list",
                    icon: EditDocumentIcon,
                    isAdminMenu: false,
                    content: "직급의 변경 내역을 확인합니다.\r\n 관리자는 직급을 추가, 수정, 삭제할 수 있습니다."
                },
                {
                    no: 5,
                    label: "직급내역 등록",
                    to: "/member/position/history/save",
                    icon: EditDocumentIcon,
                    isAdminMenu: true,
                    content: "직급의 변경 내역을 등록합니다."
                },
                {
                    no: 6,
                    label: "카테고리 등록",
                    to: "/member/category",
                    icon: EditDocumentIcon,
                    isAdminMenu: true,
                    content: "카테고리를 등록합니다."
                },
            ]
        }
    ];

export const MemberMenu = member;