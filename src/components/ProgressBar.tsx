interface ProgressBarProps {
    value: number; //0~100
    label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, label }) => {
    return (
        <div className="progress-bar">
            <div className="bar" style={{ width: `${value}%` }} />
            {label && <span>{label}</span>}
        </div>
    );
};

export default ProgressBar;