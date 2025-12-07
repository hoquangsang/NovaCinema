/**
 * Shared Types: Showtime
 * Types dùng chung giữa Backend và Frontend
 */

export type ShowtimeStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export interface ShowtimeDto {
  _id: string;
  movieId: string;
  roomId: string;
  theaterId: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  status: ShowtimeStatus;
  availableSeats: number;
  totalSeats: number;
  createdAt: string;
}

export interface CreateShowtimeDto {
  movieId: string;
  roomId: string;
  theaterId: string;
  startTime: string;
  duration: number;
  basePrice: number;
}

export interface QueryShowtimesDto {
  movieId?: string;
  theaterId?: string;
  date?: string;
  page?: number;
  limit?: number;
}
