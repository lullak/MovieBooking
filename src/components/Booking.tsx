import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Movie } from "./Types";

export const Booking: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get<Movie[]>("/movies");
      if (response.data && Array.isArray(response.data)) {
        setMovies(response.data);
        setSelectedMovie(response.data[0] || null);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedMovie]);

  const handleSeatClick = (seatNumber: number) => {
    if (!selectedMovie) return;

    if (selectedMovie.seats.occupied.includes(seatNumber)) {
      return;
    }

    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleMovieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMovieId = e.target.value;
    const movie = movies.find((m) => m.id === selectedMovieId);
    setSelectedMovie(movie || null);
  };

  return (
    <div>
      <div className="movie-container">
        <label htmlFor="movie">Pick a movie:</label>
        <select name="movie" id="movie" onChange={handleMovieChange}>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.name} ({movie.ticketPrice} kr)
            </option>
          ))}
        </select>
      </div>
      <ul className="showcase">
        <li>
          <div className="seat"></div>
          <small>N/A</small>
        </li>
        <li>
          <div className="seat selected"></div>
          <small>Selected</small>
        </li>
        <li>
          <div className="seat occupied"></div>
          <small>Occupied</small>
        </li>
      </ul>
      <div className="container">
        <div className="screen"></div>
        {selectedMovie &&
          [...Array(6)].map((_, rowIndex) => (
            <div className="row" key={rowIndex}>
              {[...Array(18)].map((_, seatIndex) => {
                const seatNumber = rowIndex * 18 + seatIndex;
                const isOccupied =
                  selectedMovie.seats.occupied.includes(seatNumber);
                const isSelected = selectedSeats.includes(seatNumber);
                return (
                  <div
                    key={seatNumber}
                    className={`seat ${isOccupied ? "occupied" : isSelected ? "selected" : ""}`}
                    onClick={() => handleSeatClick(seatNumber)}
                  ></div>
                );
              })}
            </div>
          ))}
      </div>
      <p className="text">
        You have selected <span id="count">{selectedSeats.length}</span> seats
        for a price of{" "}
        <span id="total">
          {selectedSeats.length * (selectedMovie?.ticketPrice || 0)} SEK.
        </span>
      </p>
      {selectedSeats.length > 0 && (
        <button
          className="btn"
          onClick={() =>
            navigate("/booking-form", {
              state: { selectedSeats, selectedMovie },
            })
          }
        >
          Book Now
        </button>
      )}
      <button
        className="btn"
        style={{ float: "right" }}
        onClick={() => navigate("/admin")}
      >
        Admin
      </button>
    </div>
  );
};

export default Booking;
