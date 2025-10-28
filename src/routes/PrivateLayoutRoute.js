import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";

export default function PrivateRoute() {
  
  const { user } = useContext(AuthContext);
  
  if (!user) { // 로그인 되어 있지 않다면 로그인 페이지로 replace 속성 → 브라우저 히스토리 기록을 남기지 않음
    //return <Navigate to="/login" replace />;
  }
  
  return (
     <AppLayout>
      <Outlet /> {/* Outlet으로 하위 Route 렌더링 */}
    </AppLayout>
  );
}