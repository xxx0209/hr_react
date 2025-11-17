import React from "react";
import { Home as HomeIcon } from "@mui/icons-material";

const home =
    [
        {
            id: 'home',
            icon: <HomeIcon sx={{ color: '#8b8c8dff' }} />,
            label: "홈",
            baseToNo: 1,
            useSubs: false,
            subs: [
                {
                    no: 1,
                    label: "Home",
                    to: ["/home", "/", ""],
                    icon: HomeIcon,
                    isAdminMenu: false,
                    content: "메인 대시보드 입니다."
                },
            ]
        }
    ];

export const HomeMenu = home;