import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";

const SeatSelectionPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { bookingDetails, setBookingInfo } = useContext(BookingContext);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost/van-booking-api/get_trip_details.php?trip_id=${tripId}`
        );
        const result = await response.json();

        if (result.success === 1) {
          setSeats(result.trip.seats);
          setBookingInfo("selectedTrip", {
            id: result.trip.id,
            price: result.trip.price,
            from: result.trip.from_location,
            to: result.trip.to_location,
          });
        } else {
          alert("ไม่พบข้อมูลเที่ยวรถนี้");
          navigate("/");
        }
      } catch (error) {
        alert("ไม่สามารถดึงข้อมูลที่นั่งได้");
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, setBookingInfo, navigate]);

  const handleSeatClick = (seat) => {
    if (seat.status === "booked") return;
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      alert("กรุณาเลือกอย่างน้อย 1 ที่นั่ง");
      return;
    }
    setBookingInfo("selectedSeats", selectedSeats);
    navigate("/checkout");
  };

  if (loading) {
    return <div className="loader">กำลังโหลดข้อมูลที่นั่ง...</div>;
  }

  const trip = bookingDetails.selectedTrip;
  const totalPrice = trip ? trip.price * selectedSeats.length : 0;

  return (
    <div className="card">
      <h1>เลือกที่นั่ง</h1>
      <p style={{ textAlign: "center", marginTop: "-1rem" }}>
        เส้นทาง: {trip?.from} → {trip?.to}
      </p>
      <div className="seat-map">
        {seats.map((seat) => {
          const isSelected = selectedSeats.some((s) => s.id === seat.id);
          const seatStatus = isSelected ? "selected" : seat.status;
          return (
            <div
              key={seat.id}
              className={`seat ${seatStatus}`}
              onClick={() => handleSeatClick(seat)}
            >
              {seat.seat_number}
            </div>
          );
        })}
      </div>

      <div className="summary-box">
        <h3>สรุปการจอง</h3>
        <p>
          <strong>ที่นั่งที่เลือก:</strong>{" "}
          {selectedSeats.map((s) => s.seat_number).join(", ") ||
            "ยังไม่ได้เลือก"}
        </p>
        <p>
          <strong>จำนวน:</strong> {selectedSeats.length} ที่นั่ง
        </p>
        <p>
          <strong>ราคารวม:</strong> {totalPrice} บาท
        </p>
        <button
          className="btn"
          onClick={handleConfirm}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          ยืนยันและไปต่อ
        </button>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
