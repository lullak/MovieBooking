import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Movie } from "./Types";

const Admin: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovieName, setNewMovieName] = useState("");
  const [newMoviePrice, setNewMoviePrice] = useState<number | "">("");
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get<Movie[]>("/movies");
      setMovies(response.data);
    };
    fetchMovies();
  }, []);

  const handleAddMovie = async () => {
    if (newMovieName.trim() && newMoviePrice !== "") {
      const newMovie = {
        name: newMovieName,
        ticketPrice: Number(newMoviePrice),
        seats: {
          occupied: [],
          unoccupied: Array.from({ length: 108 }, (_, i) => i),
        },
      };

      const response = await axios.post("/movies", newMovie);
      setMovies([...movies, response.data]);
      setNewMovieName("");
      setNewMoviePrice("");
      setErrorMessage(null);
    } else {
      setErrorMessage("Movie name and ticket price cannot be empty.");
    }
  };

  const handleDeleteMovie = async (id: string) => {
    await axios.delete(`/movies/${id}`);
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  const handleEditMovie = (id: string, name: string, price: number) => {
    setEditingMovieId(id);
    setNewMovieName(name);
    setNewMoviePrice(price);
    setErrorMessage(null);
  };

  const handleSaveMovie = async () => {
    if (
      editingMovieId !== null &&
      newMovieName.trim() &&
      newMoviePrice !== ""
    ) {
      const updatedMovie = {
        ...(movies.find((movie) => movie.id === editingMovieId) as Movie),
        name: newMovieName,
        ticketPrice: Number(newMoviePrice),
      };

      await axios.put(`/movies/${editingMovieId}`, updatedMovie);
      setMovies(
        movies.map((movie) =>
          movie.id === editingMovieId ? updatedMovie : movie
        )
      );
      setEditingMovieId(null);
      setNewMovieName("");
      setNewMoviePrice("");
      setErrorMessage(null);
    } else {
      setErrorMessage("Movie name and ticket price cannot be empty.");
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <div>
        <input
          type="text"
          placeholder="Movie Name"
          value={newMovieName}
          onChange={(e) => setNewMovieName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Ticket Price"
          value={newMoviePrice}
          onChange={(e) =>
            setNewMoviePrice(e.target.value ? Number(e.target.value) : "")
          }
        />
        {editingMovieId ? (
          <button className="btn2" onClick={handleSaveMovie}>
            Save
          </button>
        ) : (
          <button className="btn2" onClick={handleAddMovie}>
            Add Movie
          </button>
        )}
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            {movie.name} ({movie.ticketPrice} kr)
            <button
              className="btn2"
              onClick={() =>
                handleEditMovie(movie.id, movie.name, movie.ticketPrice)
              }
            >
              Edit
            </button>
            <button
              className="btn2"
              onClick={() => handleDeleteMovie(movie.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button className="btn" onClick={() => navigate("/")}>
        Back to Booking
      </button>
    </div>
  );
};

export default Admin;
