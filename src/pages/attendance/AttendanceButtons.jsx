import React from "react";
import { Button, Box, Stack } from "@mui/material";

function AttendanceButtons({ onCheckIn, onCheckOut }) {
    return (
        <Stack direction="row" spcacing={2}>
            <Button variant="contained" color="primary" onClick={onCheckIn}>
                출근
            </Button>
            <Button variant="contained" color="secondary" onClick={onCheckOut}>
                퇴근
            </Button>
        </Stack>
    );
}

export default AttendanceButtons;