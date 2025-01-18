export interface Movie {
  id: string;
  name: string;
  ticketPrice: number;
  seats: {
    occupied: number[];
    unoccupied: number[];
  };
}

export interface MoviesResponse {
  movies: Movie[];
}

export interface BookingFormProps {
  selectedSeats: number[];
  selectedMovie: Movie;
}