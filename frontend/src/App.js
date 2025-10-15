import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Contexts
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";

// Import Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Import Pages
import HomePage from "./pages/HomePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import EditBookingPage from "./pages/EditBookingPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Import CSS
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Navbar />
          <main className="container">
            <Routes>
              {/* === Public Routes === */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* === Private Routes === */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route
                  path="/edit-booking/:bookingId"
                  element={<EditBookingPage />}
                />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route
                  path="/select-seat/:tripId"
                  element={<SeatSelectionPage />}
                />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
              </Route>
            </Routes>
          </main>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
