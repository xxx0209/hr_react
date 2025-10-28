import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/user";

//컴포넌트 트리 전체에 데이터를 전역적으로 전달하기 위해 사용
//1. Context 생성
//2. Provider로 감싸기 (값 공급)
//3. useContext로 값 사용

//1. Context 생성
export const AuthContext = createContext();

// 2.Provider 정의
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  //Provider로 value 공급
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children} {/* 하위 컴포넌트들은 value 사용 가능 */}
    </AuthContext.Provider>
  );
};
