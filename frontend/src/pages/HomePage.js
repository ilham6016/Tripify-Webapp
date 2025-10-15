import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";

const HomePage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const { setBookingInfo } = useContext(BookingContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setBookingInfo("searchParams", { from, to, date });
    navigate("/search");
  };

  return (
    <div className="form-container">
      <h1>จองตั๋วรถตู้ เดินทางทั่วไทย</h1>
      <p
        style={{
          textAlign: "center",
          color: "#6c757d",
          marginTop: "-1rem",
          marginBottom: "2rem",
        }}
      >
        ค้นหาเที่ยวรถที่ต้องการง่ายๆ แค่ปลายนิ้ว
      </p>
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label>ต้นทาง</label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>ปลายทาง</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>วันที่เดินทาง</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">
          ค้นหาเที่ยวรถ
        </button>
      </form>
    </div>
  );
};

export default HomePage;
