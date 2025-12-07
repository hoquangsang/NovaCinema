/**
 * Showtimes API
 * API endpoints for showtime operations
 */

import { apiClient, PaginatedResponse } from '../client';

export interface Showtime {
  _id: string;
  movieId: string;
  roomId: string;
  theaterId: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  availableSeats: number;
  totalSeats: number;
}

export interface QueryShowtimesParams {
  movieId?: string;
  theaterId?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export const showtimesApi = {
  /**
   * Get showtimes
   */
  getShowtimes: async (params: QueryShowtimesParams): Promise<PaginatedResponse<Showtime>> => {
    const response = await apiClient.get('/showtimes', { params });
    return response.data;
  },

  /**
   * Get showtime by ID
   */
  getShowtimeById: async (id: string): Promise<Showtime> => {
    const response = await apiClient.get(`/showtimes/${id}`);
    return response.data;
  },

  /**
   * Get bookable showtimes for a movie at a theater
   */
  getBookableShowtimes: async (movieId: string, theaterId: string): Promise<Showtime[]> => {
    const response = await apiClient.get('/showtimes', {
      params: { movieId, theaterId },
    });
    return response.data.items;
  },
};
