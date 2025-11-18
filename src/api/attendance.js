import axios from './api';

export const checkin = async () => {
    try {
        const res = await axios.post('/attendance/checkin');
        alert(res.data);
    } catch (err) {
        alert(err.response?.data || '출근 처리 실패');
    }
};

export const checkout = async () => {
    try {
        const res = await axios.post('/attendance/checkout');
        alert(res.data);
    } catch (err) {
        alert(err.response?.data || '퇴근 처리 실패');
    }
};

export const getStatus = async () => {
    try {
        const res = await axios.get('/attendance/status');
        return res.data;
    } catch {
        return '조회 실패';
    }
};

export const getList = async (page, pageSize) => {
    try {
        const res = await axios.get('/attendance/list', {
            params: {
                page: page,
                size: pageSize
            }
        });
        console.log("리스트 응답 구조:", res.data);
        return res.data;
    } catch (err) {
        console.error("리스트 가져오기 실패:", err);
        return [];
    }
};