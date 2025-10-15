// routes/bookings.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", async (req, res) => {
  const { tripId, passengerName, passengerPhone, seatIds } = req.body; // รับเป็น array ของ seat id

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction(); // --- เริ่ม TRANSACTION ---

    // 1. ตรวจสอบว่าที่นั่งที่เลือกมายังว่างอยู่หรือไม่ และล็อคแถวข้อมูลเพื่อป้องกันการจองซ้อน
    const checkSeatsSql =
      'SELECT * FROM seats WHERE id IN (?) AND status = "booked" FOR UPDATE';
    const [bookedSeats] = await connection.query(checkSeatsSql, [seatIds]);

    if (bookedSeats.length > 0) {
      throw new Error(
        `Seat(s) ${bookedSeats
          .map((s) => s.seat_number)
          .join(", ")} are already booked.`
      );
    }

    // 2. คำนวณราคารวม
    const [tripRows] = await connection.query(
      "SELECT price FROM trips WHERE id = ?",
      [tripId]
    );
    const tripPrice = tripRows[0].price;
    const totalPrice = tripPrice * seatIds.length;

    // 3. อัปเดตสถานะที่นั่งเป็น 'booked'
    const updateSeatsSql = 'UPDATE seats SET status = "booked" WHERE id IN (?)';
    await connection.query(updateSeatsSql, [seatIds]);

    // 4. สร้างการจองใหม่ในตาราง `bookings`
    const createBookingSql =
      "INSERT INTO bookings (passenger_name, passenger_phone, total_price) VALUES (?, ?, ?)";
    const [bookingResult] = await connection.query(createBookingSql, [
      passengerName,
      passengerPhone,
      totalPrice,
    ]);
    const newBookingId = bookingResult.insertId;

    // 5. บันทึกข้อมูลลงในตารางเชื่อม `booking_seats`
    const bookingSeatsValues = seatIds.map((seatId) => [newBookingId, seatId]);
    const insertBookingSeatsSql =
      "INSERT INTO booking_seats (booking_id, seat_id) VALUES ?";
    await connection.query(insertBookingSeatsSql, [bookingSeatsValues]);

    await connection.commit(); // --- ยืนยัน TRANSACTION ---

    res.status(201).json({
      message: "Booking successful!",
      bookingId: newBookingId,
    });
  } catch (err) {
    if (connection) await connection.rollback(); // --- หากมีข้อผิดพลาด ให้ ROLLBACK ---
    console.error(err.message);
    res
      .status(500)
      .json({ message: err.message || "Failed to create booking" });
  } finally {
    if (connection) connection.release(); // คืน connection กลับสู่ pool
  }
});

module.exports = router;
