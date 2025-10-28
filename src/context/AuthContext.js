import { createContext } from 'react';

const AuthContext = createContext({
    user: {
        name: '홍길동',
        email: 'user@example.com',
        role: '관리자', //또는 '사원', '인턴'
    },
});

export default AuthContext;