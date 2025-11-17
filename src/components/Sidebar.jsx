import React from 'react';
import { Link } from "react-router-dom";



function Sidebar() {

    return (
        <div className="sidebar">
            <h3>메뉴</h3>
            <ul>
                <li><Link to="/">출석입력</Link></li>
                <li><Link to="/attendance/tracker">출퇴근 기록</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;