import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);

  // ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือยัง
  if (!isAuthenticated) {
    // ถ้ายังไม่ล็อกอิน, ให้ redirect ไปที่หน้า /login
    return <Navigate to="/login" replace />;
  }

  // ถ้าล็อกอินแล้ว, ให้แสดงหน้าที่ต้องการ (ผ่าน <Outlet />)
  return <Outlet />;
};

export default PrivateRoute;
