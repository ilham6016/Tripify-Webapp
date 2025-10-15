// routes/trips.js
const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Import connection pool

// GET /api/trips: ค้นหาเที่ยวรถ
router.get("/", async (req, res) => {
  try {
    const { from, to, date } = req.query;
    // หมายเหตุ: การ query วันที่จริงๆ ควรจัดการเรื่อง Timezone และช่วงเวลาของวัน
    const sql =
      "SELECT * FROM trips WHERE from_location = ? AND to_location = ? AND DATE(departure_time) = ?";

    // ใช้ [?] เพื่อป้องกัน SQL Injection
    const [trips] = await db.query(sql, [from, to, date]);
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET /api/trips/:id: ดูรายละเอียดเที่ยวรถพร้อมที่นั่ง
router.get("/:id", async (req, res) => {
  try {
    const tripSql = "SELECT * FROM trips WHERE id = ?";
    const [tripRows] = await db.query(tripSql, [req.params.id]);

    if (tripRows.length === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const seatsSql =
      "SELECT id, seat_number, status FROM seats WHERE trip_id = ?";
    const [seats] = await db.query(seatsSql, [req.params.id]);

    const trip = tripRows[0];
    trip.seats = seats; // เพิ่มข้อมูลที่นั่งเข้าไปใน object ของ trip

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
