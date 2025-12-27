/**
 * useShowtimeData Hook
 * Custom hook for managing showtime data fetching and state
 * Simplified since API now returns populated fields
 */

import { useState, useEffect, useCallback } from "react";
import { showtimeApi, type Showtime, type ShowtimeFilters } from "../../../api/endpoints/showtime.api";
import { theaterApi, type Theater, type Room } from "../../../api/endpoints/theater.api";
import { movieApi, type Movie } from "../../../api/endpoints/movie.api";

export interface UseShowtimeDataReturn {
  // Data
  showtimes: Showtime[];
  movies: Movie[];
  theaters: Theater[];

  // Pagination
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  total: number;
  totalPages: number;

  // Filters
  search: string;
  setSearch: (search: string) => void;
  selectedMovieId: string;
  setSelectedMovieId: (id: string) => void;
  selectedTheaterId: string;
  setSelectedTheaterId: (id: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Loading & Error states
  loading: boolean;
  error: string | null;

  // Actions
  refetch: () => void;

  // Room fetching for form
  fetchRoomsByTheaterId: (theaterId: string) => Promise<Room[]>;
}

export function useShowtimeData(): UseShowtimeDataReturn {
  // State for showtimes data
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state
  const [search, setSearch] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedTheaterId, setSelectedTheaterId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Dropdown data (for filters and form)
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);

  // Fetch dropdown data for filters and form
  const fetchDropdownData = useCallback(async () => {
    try {
      const [moviesResponse, theatersData] = await Promise.all([
        movieApi.getAllMoviesWithFilters({ limit: 1000 }),
        theaterApi.getList()
      ]);
      setMovies(moviesResponse.items);
      setTheaters(theatersData);
    } catch (err) {
      console.error("Failed to fetch dropdown data:", err);
    }
  }, []);

  // Fetch showtimes
  const fetchShowtimes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: ShowtimeFilters = {
        page,
        limit,
      };
      if (selectedMovieId) filters.movieId = selectedMovieId;
      if (selectedTheaterId) filters.theaterId = selectedTheaterId;
      if (selectedDate) filters.date = selectedDate;

      const response = await showtimeApi.getShowtimes(filters);
      setShowtimes(response.items);
      setTotal(response.total);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách suất chiếu");
      console.error("Failed to fetch showtimes:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedMovieId, selectedTheaterId, selectedDate]);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  useEffect(() => {
    fetchShowtimes();
  }, [fetchShowtimes]);

  // Handle search with debounce - reset page
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch rooms by theater ID (for form)
  const fetchRoomsByTheaterId = async (theaterId: string): Promise<Room[]> => {
    if (!theaterId) return [];
    try {
      return await theaterApi.getRoomsByTheaterId(theaterId);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      return [];
    }
  };

  return {
    showtimes,
    movies,
    theaters,
    page,
    setPage,
    limit,
    setLimit: (newLimit: number) => {
      setLimit(newLimit);
      setPage(1);
    },
    total,
    totalPages,
    search,
    setSearch,
    selectedMovieId,
    setSelectedMovieId: (id: string) => {
      setSelectedMovieId(id);
      setPage(1);
    },
    selectedTheaterId,
    setSelectedTheaterId: (id: string) => {
      setSelectedTheaterId(id);
      setPage(1);
    },
    selectedDate,
    setSelectedDate: (date: string) => {
      setSelectedDate(date);
      setPage(1);
    },
    loading,
    error,
    refetch: fetchShowtimes,
    fetchRoomsByTheaterId,
  };
}
