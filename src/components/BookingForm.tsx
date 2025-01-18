import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { BookingFormProps } from "./Types";

const BookingForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats, selectedMovie } = location.state as BookingFormProps;

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phoneNumber.trim()) {
      return;
    }

    const updatedMovie = {
      ...selectedMovie,
      seats: {
        occupied: [...selectedMovie.seats.occupied, ...selectedSeats],
        unoccupied: selectedMovie.seats.unoccupied.filter(
          (seat) => !selectedSeats.includes(seat)
        ),
      },
    };

    await axios.put(`/movies/${selectedMovie.id}`, updatedMovie);

    navigate("/moviebooking");
  };

  const totalAmount = selectedSeats.length * selectedMovie.ticketPrice;

  return (
    <div>
      <h2>Booking Confirmation</h2>
      <p>
        You have selected {selectedSeats.length} seats for a total amount of{" "}
        {totalAmount} kr.
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number: </label>
          <input
            type="number"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <button className="btn" type="submit">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
