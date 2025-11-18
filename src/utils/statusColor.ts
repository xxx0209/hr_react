export const getStatusColor = (status: string): string => {
    switch (status) {
        case "출근":
            return "#4CAF50"; //초록
        case "퇴근":
            return "#2196F3"; //파랑
        case "지각":
            return "#FF9800"; //주황
        case "결근":
            return "#F44336"; //빨강
        default:
            return "#9E9E9E"; //회색
    }
};