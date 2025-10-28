import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * 로그인 상태면 redirectTo로 이동
 * 하위 Route는 Outlet으로 렌더링
 */
export default function AuthRedirectRoute({ redirectTo = "/home" }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Outlet 안의 하위 Route 렌더링
  return <Outlet />;
}