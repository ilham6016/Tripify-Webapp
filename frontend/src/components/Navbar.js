import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        🚐 Vango
      </Link>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <span>สวัสดี, {user.name}</span>
            <button onClick={handleLogout} className="nav-button">
              ออกจากระบบ
            </button>
          </>
        ) : (
          <>
            <Link to="/login">เข้าสู่ระบบ</Link>
            <Link to="/register">สมัครสมาชิก</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
