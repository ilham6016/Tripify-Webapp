import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";

const HomePage = () => {
  // State สำหรับเก็บค่าที่เลือก
  const [selectedFromProvince, setSelectedFromProvince] = useState("");
  const [selectedToProvince, setSelectedToProvince] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [date, setDate] = useState("");

  // State สำหรับเก็บข้อมูลทั้งหมดที่ได้จาก API
  const [origins, setOrigins] = useState({}); // เปลี่ยนค่าเริ่มต้นเป็น Object {}
  const [destinations, setDestinations] = useState({}); // เปลี่ยนค่าเริ่มต้นเป็น Object {}
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { setBookingInfo } = useContext(BookingContext);

  // ดึงข้อมูลจังหวัดและสถานีทั้งหมดเมื่อเปิดหน้า
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "http://localhost/van-booking-api/get_locations.php"
        );
        const result = await response.json();
        if (result.success === 1) {
          setOrigins(result.origins);
          setDestinations(result.destinations);
        }
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลเส้นทางได้:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!fromLocation || !toLocation || !date) {
      alert("กรุณาเลือกข้อมูลให้ครบถ้วน");
      return;
    }
    setBookingInfo("searchParams", {
      from: fromLocation,
      to: toLocation,
      date,
    });
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
        {/* === ส่วนของต้นทาง === */}
        <div className="form-group">
          <label htmlFor="from-province">เลือกจังหวัดต้นทาง</label>
          <select
            id="from-province"
            value={selectedFromProvince}
            onChange={(e) => {
              setSelectedFromProvince(e.target.value);
              setFromLocation("");
            }}
            required
            disabled={loading}
          >
            <option value="" disabled>
              -- เลือกจังหวัด --
            </option>
            {/* แก้ไขตรงนี้: ใช้ Object.keys() เพื่อดึงรายชื่อจังหวัด (key) จาก object */}
            {Object.keys(origins).map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="from-location">เลือกสถานีต้นทาง</label>
          <select
            id="from-location"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            required
            disabled={!selectedFromProvince}
          >
            <option value="" disabled>
              -- เลือกสถานี --
            </option>
            {/* แก้ไขตรงนี้: ดึง array ของสถานีจากจังหวัดที่ถูกเลือก */}
            {selectedFromProvince &&
              origins[selectedFromProvince].map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
          </select>
        </div>

        {/* === ส่วนของปลายทาง === */}
        <div className="form-group">
          <label htmlFor="to-province">เลือกจังหวัดปลายทาง</label>
          <select
            id="to-province"
            value={selectedToProvince}
            onChange={(e) => {
              setSelectedToProvince(e.target.value);
              setToLocation("");
            }}
            required
            disabled={loading}
          >
            <option value="" disabled>
              -- เลือกจังหวัด --
            </option>
            {/* แก้ไขตรงนี้: ใช้ Object.keys() */}
            {Object.keys(destinations).map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="to-location">เลือกสถานีปลายทาง</label>
          <select
            id="to-location"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            required
            disabled={!selectedToProvince}
          >
            <option value="" disabled>
              -- เลือกสถานี --
            </option>
            {/* แก้ไขตรงนี้: ดึง array ของสถานี */}
            {selectedToProvince &&
              destinations[selectedToProvince].map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
          </select>
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

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "กำลังโหลด..." : "ค้นหาเที่ยวรถ"}
        </button>
      </form>
    </div>
  );
};

export default HomePage;
