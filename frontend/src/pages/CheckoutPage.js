import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";
import { AuthContext } from "../context/AuthContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { bookingDetails, setBookingInfo } = useContext(BookingContext);
  const { isAuthenticated, user } = useContext(AuthContext);

  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการจอง");
      navigate("/login");
    } else {
      setPassengerName(user.name);
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingPayload = {
      tripId: bookingDetails.selectedTrip.id,
      seatIds: bookingDetails.selectedSeats.map((s) => s.id),
      passengerName,
      passengerPhone,
    };

    try {
      const response = await fetch(
        "http://localhost/van-booking-api/create_booking.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingPayload),
        }
      );
      const result = await response.json();

      if (result.success !== 1) {
        throw new Error(result.message);
      }

      setBookingInfo("passengerInfo", {
        name: passengerName,
        phone: passengerPhone,
      });
      setBookingInfo("bookingId", result.bookingId);

      navigate("/confirmation");
    } catch (error) {
      alert(`จองไม่สำเร็จ: ${error.message}`);
    }
  };

  const { selectedTrip, selectedSeats } = bookingDetails;

  if (!isAuthenticated) {
    return <div className="loader">กำลังเปลี่ยนเส้นทาง...</div>;
  }

  if (!selectedTrip || !selectedSeats || selectedSeats.length === 0) {
    return <p>ไม่พบข้อมูลการจอง กรุณากลับไปหน้าแรก</p>;
  }

  const totalPrice = selectedTrip.price * selectedSeats.length;

  return (
    <div className="card">
      <h1>กรอกข้อมูลและยืนยัน</h1>
      <div className="summary-box">
        <h3>สรุปรายการ</h3>
        <p>
          <strong>เส้นทาง:</strong> {selectedTrip.from} → {selectedTrip.to}
        </p>
        <p>
          <strong>ที่นั่ง:</strong>{" "}
          {selectedSeats.map((s) => s.seat_number).join(", ")}
        </p>
        <p>
          <strong>ราคารวม:</strong> {totalPrice} บาท
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
        <div className="form-group">
          <label>ชื่อ-นามสกุล</label>
          <input
            type="text"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>เบอร์โทรศัพท์</label>
          <input
            type="text"
            value={passengerPhone}
            onChange={(e) => setPassengerPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">
          ยืนยันการจอง
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
