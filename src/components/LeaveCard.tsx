interface LeaveCardProps {
    remaining: number;
    expirationDate: string;
}

const LeaveCard: React.FC<LeaveCardProps> = ({ remaining, expirationDate }) => {
    return (
        <div style={{ marginTop: "20px" }}>
            <h3>최근 휴가 내역</h3>

        </div>
    );
};

export default LeaveCard;