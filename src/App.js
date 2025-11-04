import React from 'react';
import './index.css';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AttendanceTracker from './pages/AttendanceTracker';
import './App.css';
import { AuthProvider } from "./context/AuthContext";
import { EnumProvider } from "./context/EnumContext"
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <AttendanceTracker />
      </div>
    </div>
  );
}

export default App;


