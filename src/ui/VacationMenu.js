import {
    BeachAccess as BeachAccessIcon,
    Diversity3 as Diversity3Icon,
    EditDocument as EditDocumentIcon,
    ManageAccounts as ManageAccountsIcon,
    History as HistoryIcon,
} from "@mui/icons-material";

const vacation = [
  {
    id: "vacation",
    icon: <BeachAccessIcon sx={{ color: "#8b8c8dff" }} />,
    label: "휴가관리",
    baseToNo: 0,
    useSubs: true,
    subs: [
      {
        no: 0,
        label: "휴가현황",
        to: "/vacation/list",
        icon: Diversity3Icon,
        isAdminMenu: false,
        content: "승인된 휴가 내역 및 연차 현황을 확인합니다.",
      },
      {
        no: 1,
        label: "휴가내역",
        to: "/vacation/history",
        icon: HistoryIcon,
        isAdminMenu: false,
        content: "연도별 연차 사용 및 잔여 내역을 확인합니다.",
      },
    ],
  },
];

export const VacationMenu = vacation;