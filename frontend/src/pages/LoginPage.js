import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // ... โค้ด fetch API เหมือนเดิม ...
  };

  return (
    <div
      className="form-container"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <h1>เข้าสู่ระบบ</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>อีเมล</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>รหัสผ่าน</label>
          <input
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
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิกที่นี่</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
