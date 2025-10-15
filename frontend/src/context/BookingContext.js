import React, { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState({
    searchParams: null,
    selectedTrip: null,
    selectedSeats: [],
    passengerInfo: null,
    bookingId: null,
  });

  const setBookingInfo = (key, value) => {
    setBookingDetails((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <BookingContext.Provider value={{ bookingDetails, setBookingInfo }}>
      {children}
    </BookingContext.Provider>
  );
};
