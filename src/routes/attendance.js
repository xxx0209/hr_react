const express = require("express");
const router = express.Router();

//출근 라우터
router.post("/checkin", (req, res) => {
    console.log("출근 요청 도착:", req.body);
    //출근 처리 로직 (예: DB 저장 등)
    res.status(200).json({ message: "출근 완료" });
});

//퇴근 라우터
router.post("/checkout", (req, res) => {
    console.log("퇴근 요청 도착:", req.body);
    //퇴근 처리 로직
    res.status(200).json({ message: "퇴근 완료" });
});

module.exports = router;