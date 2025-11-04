interface LeaveData {
    date: string;
    type: string;
    reason: string;
}

interface LeaveCardProps {
    leaves: LeaveData[];
}

const LeaveCard: React.FC<LeaveCardProps> = ({ leaves }) => {
    return (
        <div style={{ marginTop: "20px" }}>
            <h3>최근 휴가 내역</h3>
            {leaves.map((leave, index) => (
                <div key={index} style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "8px",
                    backgroundColor: "#f9f9f9"
                }}>
                    <p><strong>{leave.date}</strong> - {leave.type}</p>
                    <p style={{ fontSize: "14px", color: "#555" }}>{leave.reason}</p>
                </div>
            ))}
        </div>
    );
};

export default LeaveCard;