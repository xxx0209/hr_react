function LeaveStatusBadge({ status }) {
    const statusMap = {
        PENDING: { label: "결재 대기", color: "#A0A0A0", icon: "⏳" },
        APPROVED: { label: "승인", color: "#4CAF50", icon: "✅" },
        REJECTED: { label: "반려", color: "#F44336", icon: "❌" },
    };

    const { label, color, icon } = statusMap[status] || {};

    return (
        <span style={{
            color,
            fontWeight: "bold",
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: "#f5f5f5"
        }}>
            {icon} {label}
        </span>
    )
}