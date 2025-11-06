import React, { useEffect, useState, useContext } from "react";
import { Table, Card, Spinner, Alert, Row, Col } from "react-bootstrap";
import axios from "../api/api";
import { AuthContext } from "../context/AuthContext"; // 로그인 정보

export default function MySalaryHistory() {
  const [list, setList] = useState([]); // 급여 목록
  const [selected, setSelected] = useState(null); // 선택된 급
