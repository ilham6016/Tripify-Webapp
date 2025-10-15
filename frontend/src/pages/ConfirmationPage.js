import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";

const ConfirmationPage = () => {
  const { bookingDetails } = useContext(BookingContext);
  const {
    searchParams,
    selectedTrip,
    selectedSeats,
    passengerInfo,
    bookingId,
  } = bookingDetails;

  if (!bookingId) {
    return (
      <div className="card">
        <p style={{ textAlign: "center" }}>ไม่พบข้อมูลการจอง</p>
        <Link to="/" className="btn">
          กลับหน้าแรก
        </Link>
      </div>
    );
  }

  // สร้างรหัสการจองให้ดูดีขึ้น
  const displayBookingId = `VANGO-${String(bookingId).padStart(5, "0")}`;

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h1 style={{ color: "#28a745" }}>✔ การจองสำเร็จ!</h1>
      <p>ขอบคุณที่ใช้บริการครับ นี่คือรายละเอียดการจองของคุณ:</p>

      <div className="summary-box" style={{ textAlign: "left" }}>
        <h3>รหัสการจอง: {displayBookingId}</h3>
        <p>
          <strong>ผู้โดยสาร:</strong> {passengerInfo?.name}
        </p>
        <p>
          <strong>เบอร์โทรศัพท์:</strong> {passengerInfo?.phone}
        </p>
        <hr />
        <p>
          <strong>เส้นทาง:</strong> {selectedTrip?.from} → {selectedTrip?.to}
        </p>
        <p>
          <strong>วันที่เดินทาง:</strong> {searchParams?.date}
        </p>
        <p>
          <strong>ที่นั่ง:</strong>{" "}
          {selectedSeats.map((s) => s.seat_number).join(", ")}
        </p>
      </div>

      <Link to="/" className="btn" style={{ marginTop: "2rem" }}>
        กลับไปที่หน้าแรก
      </Link>
    </div>
  );
};

export default ConfirmationPage;
