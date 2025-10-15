import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const EditBookingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for booking data
  const [bookingInfo, setBookingInfo] = useState(null);
  const [allSeats, setAllSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);

  // State for form inputs
  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!user) return;
      try {
        const response = await fetch(
          `http://fms.pnu.ac.th/ilhammm/van-booking-api/get_booking_details.php?booking_id=${bookingId}&user_id=${user.id}`
        );
        const result = await response.json();
        if (result.success === 1) {
          setBookingInfo(result.booking);
          setAllSeats(result.all_seats_for_trip);
          setSelectedSeatIds(result.selected_seat_ids);
          setPassengerName(result.booking.passenger_name);
          setPassengerPhone(result.booking.passenger_phone);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId, user]);

  const handleSeatClick = (seat) => {
    // อนุญาตให้เลือก/ยกเลิกที่นั่งของตัวเอง หรือเลือกที่นั่งที่ว่างเท่านั้น
    if (seat.status === "booked" && !selectedSeatIds.includes(seat.id)) {
      return; // ที่นั่งคนอื่น ห้ามเลือก
    }
    const isSelected = selectedSeatIds.includes(seat.id);
    if (isSelected) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (selectedSeatIds.length === 0) {
      alert("กรุณาเลือกอย่างน้อย 1 ที่นั่ง");
      return;
    }

    const payload = {
      bookingId: parseInt(bookingId),
      userId: user.id,
      passengerName,
      passengerPhone,
      newSeatIds: selectedSeatIds,
    };

    try {
      const response = await fetch(
        "http://fms.pnu.ac.th/ilhammm/van-booking-api/update_booking.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (result.success === 1) {
        alert("แก้ไขการจองสำเร็จ!");
        navigate("/my-bookings");
      } else {
        alert(`เกิดข้อผิดพลาด: ${result.message}`);
      }
    } catch (err) {
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  if (loading) return <div className="loader">กำลังโหลดข้อมูลการจอง...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  const totalPrice = bookingInfo
    ? bookingInfo.price * selectedSeatIds.length
    : 0;

  return (
    <div className="card">
      <h1>แก้ไขการจอง</h1>
      <p style={{ textAlign: "center", marginTop: "-1rem" }}>
        เส้นทาง: {bookingInfo?.from_location} → {bookingInfo?.to_location}
      </p>

      <div className="seat-map">
        {allSeats.map((seat) => {
          const isSelected = selectedSeatIds.includes(seat.id);
          let status = seat.status;
          if (isSelected) {
            status = "selected";
          } else if (status === "booked") {
            status = "booked"; // ที่นั่งคนอื่น
          } else {
            status = "available";
          }
          return (
            <div
              key={seat.id}
              className={`seat ${status}`}
              onClick={() => handleSeatClick(seat)}
            >
              {seat.seat_number}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleUpdate} style={{ marginTop: "2rem" }}>
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

        <div className="summary-box">
          <h3>สรุปการแก้ไข</h3>
          <p>
            <strong>จำนวนที่นั่งใหม่:</strong> {selectedSeatIds.length} ที่นั่ง
          </p>
          <p>
            <strong>ราคารวมใหม่:</strong> {totalPrice} บาท
          </p>
        </div>

        <button
          type="submit"
          className="btn"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          บันทึกการเปลี่ยนแปลง
        </button>
      </form>
    </div>
  );
};

export default EditBookingPage;
