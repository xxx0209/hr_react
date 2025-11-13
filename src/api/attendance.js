import axios from "axios";

//출결 데이터 불러오기
export const fetchAttendanceData = () => {
    return axios.get("/api/attendance");
};

//출근 기록
export const checkIn = () => {
    return axios.post("/api/attendance/checkin");
};

//퇴근 기록
export const checkOut = () => {
    return axios.post("/api/attendance/checkout");
};