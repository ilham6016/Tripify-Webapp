import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";

const SearchResultsPage = () => {
  const { bookingDetails, setBookingInfo } = useContext(BookingContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // ... โค้ด fetch API เหมือนเดิม ...
  }, [bookingDetails.searchParams, navigate]);

  const handleSelectTrip = (trip) => {
    setBookingInfo("selectedTrip", trip);
    navigate(`/select-seat/${trip.id}`);
  };

  if (loading) {
    return <div className="loader">กำลังค้นหาเที่ยวรถ...</div>;
  }

  return (
    <div>
      <h2>ผลการค้นหา</h2>
      <p style={{ color: "#6c757d" }}>
        เส้นทาง: {bookingDetails.searchParams?.from} →{" "}
        {bookingDetails.searchParams?.to}
      </p>

      {trips.length > 0 ? (
        trips.map((trip) => (
          <div className="card" key={trip.id}>
            <div className="card-content">
              <div className="card-info">
                <p>
                  <strong>เวลาออกเดินทาง:</strong>{" "}
                  {new Date(trip.departure_time).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  น.
                </p>
                <p>
                  <strong>ราคา:</strong> {trip.price} บาท/ที่นั่ง
                </p>
              </div>
              <div className="card-actions">
                <button className="btn" onClick={() => handleSelectTrip(trip)}>
                  เลือกเที่ยวรถ
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card">
          <p style={{ textAlign: "center" }}>ไม่พบเที่ยวรถในวันที่คุณเลือก</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
