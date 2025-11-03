import React from 'react';
import './UserInfoCard.css';

const UserInfoCard = ({ name, position, workType }) => {
    return (
        <div className="user-info-card">
            <h2>내 정보</h2>
            <ul>
                <li><strong>이름:</strong> {name}</li>
                <li><strong>직급:</strong> {position}</li>
                <li><strong>근무 유형:</strong> {workType}</li>
            </ul>
        </div>
    );
};

export default UserInfoCard;