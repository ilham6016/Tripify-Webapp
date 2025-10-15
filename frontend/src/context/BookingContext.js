import React, { createContext, useState, useCallback } from "react"; // 1. import useCallback

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState({
    searchParams: null,
    selectedTrip: null,
    selectedSeats: [],
    passengerInfo: null,
    bookingId: null,
  });

  // 2. ใช้ useCallback ห่อหุ้มฟังก์ชันนี้ไว้
  // useCallback จะช่วย "จำ" ฟังก์ชันนี้ไว้ ทำให้มันไม่ถูกสร้างขึ้นใหม่ทุกครั้งที่ re-render
  const setBookingInfo = useCallback((key, value) => {
    setBookingDetails((prev) => ({ ...prev, [key]: value }));
  }, []); // ใส่ [] เพื่อบอกว่าฟังก์ชันนี้ไม่มีวันเปลี่ยนแปลง

  return (
    <BookingContext.Provider value={{ bookingDetails, setBookingInfo }}>
      {children}
    </BookingContext.Provider>
  );
};
