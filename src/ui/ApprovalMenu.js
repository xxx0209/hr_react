import {
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    Diversity3 as Diversity3Icon,
    EditDocument as EditDocumentIcon,
    ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";

const approval =
    [
        {
            id: 'approval',
            icon: <AssignmentTurnedInIcon sx={{ color: '#8b8c8dff' }} />,
            label: "전자결재",
            baseToNo: 1,
            subs: [
                {
                    no: 1,
                    label: "결재 현황",
                    to: "/approval/status",
                    icon: ManageAccountsIcon,
                    isAdminMenu: false,
                    content: "결재 현황을 확인할 수 있는 메뉴입니다."
                },
                {
                    no: 2,
                    label: "기안 작성",
                    to: "/approval/request",
                    icon: Diversity3Icon,
                    isAdminMenu: false,
                    content: "기안을 작성할 수 있는 메뉴입니다."
                },
                {
                    no: 3,
                    label: "임시 보관함",
                    to: "/approval/temp",
                    icon: EditDocumentIcon,
                    isAdminMenu: false,
                    content: "임시 보관함을 확인할 수 있는 메뉴입니다."
                },
            ]
        }
    ];

export const ApprovalMenu = approval;