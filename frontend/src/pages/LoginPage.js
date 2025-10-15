import React, { useState, useContext } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { isAuthenticated, login } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost/van-booking-api/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const result = await response.json();

      if (result.success === 1) {
        login(result.user);
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div
      className="form-container"
      style={{ maxWidth: "450px", margin: "auto" }}
    >
      <h1>เข้าสู่ระบบ</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">อีเมล</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">รหัสผ่าน</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn">
          เข้าสู่ระบบ
        </button>
        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิกที่นี่</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
