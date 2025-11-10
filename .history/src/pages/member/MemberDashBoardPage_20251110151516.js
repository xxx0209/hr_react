import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Modal, Badge } from "react-bootstrap";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import ko from "date-fns/locale/ko";
import DatePicker from "react-datepicker";
import { formatInTimeZone } from "date-fns-tz";
import axios from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import SelectCombo from "../../sample/SelectCombo";
import { ButtonGroup, IconButton, Tooltip, Button } from "@mui/material";
import { Button as BasicButton } from "react-bootstrap";

import { ArrowBackIos, ArrowBackIosNew, ArrowForwardIos, Today } from "@mui/icons-material"
import { ToggleButton, ToggleButtonGroup } from "@mui/material"

import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";

const locales = { ko };
const localizer = dateFnsLocalizer({
    format, parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales,
});

const ETC_SCHEDULE_LIST = ["checkIn", "checkOut"];

export default function MemberDashBoardPage() {



    return (
        <Card className="dashboard-card text-center">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
                    alt="프로필"
                    className="rounded-circle mb-3"
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                />
                <h5>관리자</h5>
                <p className="text-muted small mb-1">개발팀 / 과장</p>
            </Card.Body>
        </Card>

    );
}

