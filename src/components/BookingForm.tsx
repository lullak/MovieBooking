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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneNumberPattern = /^[0-9]{10}$/;
    if (!name.trim() || !phoneNumber.trim()) {
      setErrorMessage("Name and Phone Number cannot be empty.");
      return;
    }
    if (!phoneNumberPattern.test(phoneNumber)) {
      setErrorMessage("Phone Number must be 10 digits.");
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

    const newUser = {
      userName: name,
      phoneNumber: Number(phoneNumber),
      movieName: selectedMovie.name,
      seatNumbers: selectedSeats,
    };

    await axios.put(`/movies/${selectedMovie.id}`, updatedMovie);
    await axios.post("/users", newUser);
    setErrorMessage(null);

    navigate("/moviebooking");
  };

  const totalAmount = selectedSeats.length * selectedMovie.ticketPrice;

  return (
    <div>
      <h2>Booking Confirmation</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <p>
        You have selected {selectedSeats.length} seats for a total amount of{" "}
        {totalAmount} SEK.
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number: </label>
          <input
            type="number"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <button className="btn" type="submit">
          Confirm Booking
        </button>
        <button
          className="btn float-right"
          onClick={() => navigate("/moviebooking")}
        >
          Back to Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
