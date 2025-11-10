import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "../../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import RadioGroup from "../../sample/RadioGroup";
import { EnumContext } from "../../context/EnumContext";
import { API_BASE_URL } from "../../config/config";

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

