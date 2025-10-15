import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";

// Import Pages
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Import CSS
import "./App.css";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        🚐 Vango
      </Link>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <span>สวัสดี, {user.name}</span>
            <button onClick={handleLogout} className="nav-button">
              ออกจากระบบ
            </button>
          </>
        ) : (
          <>
            <Link to="/login">เข้าสู่ระบบ</Link>
            <Link to="/register">สมัครสมาชิก</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route
                path="/select-seat/:tripId"
                element={<SeatSelectionPage />}
              />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
            </Routes>
          </main>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
