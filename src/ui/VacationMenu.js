import {
  BeachAccess as BeachAccessIcon,
  Surfing as SurfingIcon,
  Storefront as StorefrontIcon
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
        icon: <SurfingIcon sx={{ color: "#ee4175ff" }} />,
        isAdminMenu: false,
        content: "승인된 휴가 내역 및 연차 현황을 확인합니다.",
      },
      {
        no: 1,
        label: "휴가내역",
        to: "/vacation/history",
        icon: <StorefrontIcon sx={{ color: "#ee4175ff" }} />,
        isAdminMenu: false,
        content: "연도별 연차 사용 및 잔여 내역을 확인합니다.",
      },
    ],
  },
];

export const VacationMenu = vacation;