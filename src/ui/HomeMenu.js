import React from "react";
import { Home as HomeIcon } from "@mui/icons-material";

const home =
    [
        {
            id: 'home',
            icon: <HomeIcon sx={{ color: '#8b8c8dff' }} />,
            label: "홈",
            baseToNo: 0,
            subs: []
        }
    ];

export const HomeMenu = home;