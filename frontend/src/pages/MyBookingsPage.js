import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost/van-booking-api/my_bookings.php?user_id=${user.id}`
      );
      const result = await response.json();

      // --- จุดแก้ไขที่สำคัญ ---
      // ตรวจสอบให้แน่ใจว่า result.bookings เป็น Array จริงๆ ก่อนที่จะ set state
      if (result.success === 1 && Array.isArray(result.bookings)) {
        setBookings(result.bookings);
      } else {
        // ถ้า API trả về lỗi หรือ bookings không phải array ให้ set เป็น array ว่าง
        setBookings([]);
        console.error("API Error or invalid data format:", result.message);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]); // กรณี fetch ล้มเหลว ก็ให้เป็น array ว่างเช่นกัน
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?")) {
      return;
    }
    try {
      const response = await fetch(
        "http://localhost/van-booking-api/cancel_booking.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_id: bookingId, user_id: user.id }),
        }
      );
      const result = await response.json();
      if (result.success === 1) {
        alert("ยกเลิกการจองสำเร็จ");
        fetchBookings();
      } else {
        alert(`เกิดข้อผิดพลาด: ${result.message}`);
      }
    } catch (error) {
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  if (loading) {
    return <div className="loader">กำลังโหลดข้อมูลการจอง...</div>;
  }

  return (
    <div>
      <h1>การจองของฉัน</h1>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div className="card" key={booking.id}>
            <div className="card-content">
              <div className="card-info">
                <p>
                  <strong>รหัสการจอง:</strong> VANGO-
                  {String(booking.id).padStart(5, "0")}
                </p>
                <p>
                  <strong>เส้นทาง:</strong> {booking.from_location} (
                  {booking.from_province}) → {booking.to_location} (
                  {booking.to_province})
                </p>
                <p>
                  <strong>เวลาเดินทาง:</strong>{" "}
                  {new Date(booking.departure_time).toLocaleString("th-TH")}
                </p>
                <p>
                  <strong>ผู้โดยสาร:</strong> {booking.passenger_name} (
                  {booking.passenger_phone})
                </p>
              </div>
              <div className="card-actions">
                <Link
                  to={`/edit-booking/${booking.id}`}
                  className="btn"
                  style={{
                    marginRight: "10px",
                    backgroundColor: "#ffc107",
                    color: "#212529",
                  }}
                >
                  แก้ไข
                </Link>
                <button
                  className="btn"
                  onClick={() => handleCancelBooking(booking.id)}
                  style={{ backgroundColor: "#dc3545" }}
                >
                  ยกเลิกการจอง
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card">
          <p style={{ textAlign: "center" }}>คุณยังไม่มีรายการจอง</p>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
