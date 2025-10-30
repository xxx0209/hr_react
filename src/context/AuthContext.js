import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/user";
import axios from "../api/api";

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
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   getCurrentUser()
  //     .then(res => {
  //       console.log("getCurrentUser 결과:", res);       // 전체 응답 확인
  //       console.log("getCurrentUser 데이터:", res.data); // 실제 데이터 확인
  //       setUser(res.data)
  //     })
  //     .catch((err) => {
  //       console.error("getCurrentUser 에러:", err);
  //       setUser(null)
  //     });
  // }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/user/me");
        setUser(res.data);
      } catch (err) {
        console.error("유저 정보 조회 실패:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;



  //Provider로 value 공급
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children} {/* 하위 컴포넌트들은 value 사용 가능 */}
    </AuthContext.Provider>
  );
};
