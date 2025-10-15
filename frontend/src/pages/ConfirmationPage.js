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
      <div>
        <p>ไม่พบข้อมูลการจอง</p>
        <Link to="/" className="btn">
          กลับหน้าแรก
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ color: "green" }}>✔ การจองสำเร็จ!</h1>
      <p>ขอบคุณที่ใช้บริการครับ นี่คือรายละเอียดการจองของคุณ:</p>

      <div className="summary-box">
        <h3>รหัสการจอง: {bookingId}</h3>
        <p>
          <strong>ผู้โดยสาร:</strong> {passengerInfo?.name}
        </p>
        <p>
          <strong>เบอร์โทรศัพท์:</strong> {passengerInfo?.phone}
        </p>
        <hr />
        <p>
          <strong>เส้นทาง:</strong> {searchParams?.from} → {searchParams?.to}
        </p>
        <p>
          <strong>วันที่เดินทาง:</strong> {searchParams?.date}
        </p>
        <p>
          <strong>เวลา:</strong> {selectedTrip?.departureTime} -{" "}
          {selectedTrip?.arrivalTime}
        </p>
        <p>
          <strong>ที่นั่ง:</strong>{" "}
          {selectedSeats.map((s) => s.seatNumber).join(", ")}
        </p>
      </div>

      <Link to="/" className="btn" style={{ marginTop: "2rem" }}>
        กลับไปที่หน้าแรก
      </Link>
    </div>
  );
};

export default ConfirmationPage;
