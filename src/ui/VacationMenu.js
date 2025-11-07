import {
    BeachAccess as BeachAccessIcon,
    Diversity3 as Diversity3Icon,
    EditDocument as EditDocumentIcon,
    ManageAccounts as ManageAccountsIcon
} from "@mui/icons-material";

const vacation =
    [
        {
            id: 'vacation',
            icon: <BeachAccessIcon sx={{ color: '#8b8c8dff' }} />,
            label: "휴가관리",
            baseToNo: 0,
            useSubs: false,
            subs: [
                {
                    no: 0,
                    label: "휴가관리",
                    to: "/salary/salaries",
                    icon: ManageAccountsIcon,
                    isAdminMenu: false,
                    content: "휴가 관리를 합니다."
                },
            ]
        }
    ];

export const VacationMenu = vacation;