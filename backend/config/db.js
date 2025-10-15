const mysql = require("mysql2");
require("dotenv").config();

// ใช้ createPool เพื่อการจัดการ connection ที่มีประสิทธิภาพสำหรับเว็บแอปพลิเคชัน
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// เราจะใช้ Promise-based API ซึ่งเขียนโค้ดได้ง่ายกว่า
module.exports = pool.promise();
