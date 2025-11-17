import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

//사용자 정의 타입 예시
interface User {
    id: number;
    name: string;
    isAdmin: boolean;
}

const App: React.FC = () => {
    const user: User = {
        id: 1,
        name: '승규',
        isAdmin: true,
    };

    const greetUser = (name: string): string => {
        return `안녕하세요, ${name}님!`;
    };

    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;