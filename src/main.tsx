import "./axiosConfig";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Booking from "./components/Booking";
import BookingForm from "./components/BookingForm";
import Admin from "./components/Admin";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/moviebooking" element={<Booking />} />
        <Route path="/booking-form" element={<BookingForm />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  </StrictMode>
);
