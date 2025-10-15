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

  // ... (ส่วนที่เหลือของ component เหมือนเดิม) ...
};

export default CheckoutPage;
