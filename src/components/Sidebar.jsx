import React from 'react';
import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div className="sidebar">
            <h3>메뉴</h3>
            <ul>
                <li><Link to="/">승인목록 </Link></li>
                <li><Link to="/test-approval">테스트 승인</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;