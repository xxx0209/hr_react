export interface LeaveCardProps {
    used: number;
    remaining: number;
    expirationDate: string;
}

export interface WeeklySummaryProps {
    totalWorkHours: number;
    breakHours: number;
    overtimeHours: number;
}