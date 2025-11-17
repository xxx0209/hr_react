interface StatCardProps {
    label: string;
    value: string;
    icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
    <div className="stat-card">
        <span>{icon}</span>
        <strong>{label}</strong>
        <p>{value}</p>
    </div>
);

export default StatCard;