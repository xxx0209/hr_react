import AppRoutes from './routes/AppRoutes';
import AuthContext from './context/AuthContext'; // 경로 맞게 수정
import React from 'react';

import './index.css';
import './App.css';

function App() {
  const user = {
    name: '홍길동',
    email: 'user@example.com',
    role: '관리자',
  };

  return (
    <AuthContext.Provider value={{ user }}>
      <AppRoutes />
    </AuthContext.Provider>
  );
}


export default App;

