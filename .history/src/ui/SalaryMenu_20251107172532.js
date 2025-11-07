import {
    AttachMoney as AttachMoneyIcon,
    Diversity3 as Diversity3Icon,
    EditDocument as EditDocumentIcon,
    ManageAccounts as ManageAccountsIcon
} from "@mui/icons-material";

const salary =
    [
        {
            id: 'salary',
            icon: <AttachMoneyIcon sx={{ color: '#8b8c8dff' }} />,
            label: "급여관리",
            baseToNo: 1,
            useSubs: true,
            subs: [
                {
                    no: 1,
                    label: "나의 급여 내역",
                    to: "/salary/my-salaries",
                    icon: ManageAccountsIcon,
                    isAdminMenu: false,
                    content: "나의 급여 내역을 확인할수 있는 메뉴 입니다."
                },
                {
                    no: 2,
                    label: "전체 급여 목록 (관리자)",
                    to: "/salary/salaries/completed",
                    icon: Diversity3Icon,
                    isAdminMenu: true,
                    content: "회사의 급여 목록을 관리합니다.\r\n  관리자는 급여를 추가, 수정, 삭제할 수 있습니다."
                },
                {
                    no: 3,
                    label: "급여 생성",
                    to: "/salary/salaries/new",
                    icon: EditDocumentIcon,
                    isAdminMenu: false,
                    content: "급여 생성을 위한 메뉴입니다."
                },
                {
                    no: 4,
                    label: "승인 대기 급여",
                    to: "/salary/salaries/pending",
                    icon: EditDocumentIcon,
                    isAdminMenu: true,
                    content: "승인 대기 중인 급여 내역을 확인할 수 있는 메뉴입니다."
                },
                {
                    no: 4,
                    label: "기본급 설정",
                    to: "/salary/base-salary",
                    icon: EditDocumentIcon,
                    isAdminMenu: true,
                    content: "기본급을 설정할 수 있는 메뉴입니다."
                },
            ]
        }
    ];

export const SalaryMenu = salary;