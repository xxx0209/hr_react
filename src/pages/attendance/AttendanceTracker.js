import React, { useEffect, useState } from "react";
import AttendanceButtons from "./AttendanceButtons";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Checkbox,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function AttendanceTracker() {
    const [records, setRecords] = useState([]);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    const [status, setStatus] = useState('checkedOut');

    //기록 불러오기
    useEffect(() => {
        const storedRecords = JSON.parse(localStorage.getItem("attendance")) || [];
        setRecords(storedRecords);
    }, []);

    //기록 저장 함수
    const saveRecord = (record) => {
        const updatedRecords = [...records, record];
        setRecords(updatedRecords);
        localStorage.setItem("attendance", JSON.stringify(updatedRecords));
    };

    //출근/퇴근 기록 추가
    const handleRecord = (type) => {
        const now = new Date();
        const newRecord = {
            id: Date.now(),
            type,
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            selected: false,
        };
        saveRecord(newRecord);
    };

    //기록 삭제
    const handleDelete = (id) => {
        const updatedRecords = records.filter((r) => r.id !== id);
        setRecords(updatedRecords);
        localStorage.setItem('attendance', JSON.stringify(updatedRecords));
    };

    //선택 토글
    const toggleSelected = (id) => {
        const updatedRecords = records.map((r) =>
            r.id === id ? { ...r, selected: !r.selected } : r
        );
        setRecords(updatedRecords);
        localStorage.setItem('attendance', JSON.stringify(updatedRecords));
    };

    //날짜별 그룹화
    const groupedRecords = (showSelectedOnly ? records.filter((r) => r.selected) : records)
        .reduce((acc, record) => {
            if (!acc[record.date]) acc[record.date] = [];
            acc[record.date].push(record);
            return acc;
        }, {});

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                출퇴근 기록
            </Typography>

            <Box sx={{ marginBottom: '16px' }}>
                <Button variant="contained" onClick={() => handleRecord('출근')} sx={{ marginRight: '8px' }}>
                    출근
                </Button>
                <Button variant="contained" onClick={() => handleRecord('퇴근')}>
                    퇴근
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                    sx={{ marginLeft: '16px' }}
                >
                    {showSelectedOnly ? '전체 보기' : '선택된기록만 보기'}
                </Button>
            </Box>

            {records.length === 0 ? (
                <Typography>출퇴근 기록이 없습니다.</Typography>
            ) : (
                Object.entries(groupedRecords).map(([date, dailyRecords]) => (
                    <Box key={date} style={{ marginBottom: '24px' }}>
                        <Typography variant="h6" sx={{ marginBottom: '8px' }}>
                            📅 {date}
                        </Typography>
                        <List>
                            {dailyRecords.map((record) => (
                                <ListItem
                                    key={record.id}
                                    sx={{
                                        backgroundColor: record.selected ? '#e0f7fa' : 'transparent',
                                        borderRadius: '8px',
                                    }}
                                    secondaryAction={
                                        <IconButton edge="end" onClick={() => handleDelete(record.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <Checkbox
                                        checked={record.selected || false}
                                        onChange={() => toggleSelected(record.id)}
                                    />
                                    <ListItemText
                                        primary={`${record.type} - ${record.time}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))
            )}
        </Box>
    );
}

export default AttendanceTracker;