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
          });
        } else {
          console.error("API Error:", result.message);
          alert("ไม่พบข้อมูลเที่ยวรถนี้");
          navigate("/");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลที่นั่ง:", error);
        alert("ไม่สามารถดึงข้อมูลที่นั่งได้");
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, setBookingInfo, navigate]);

  // ... (ส่วนที่เหลือของ component เหมือนเดิม) ...
};

export default SeatSelectionPage;
