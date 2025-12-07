/**
 * Bookings API
 * API endpoints for booking operations
 */

import { apiClient, PaginatedResponse } from '../client';

export interface BookedSeat {
  seatId: string;
  row: string;
  number: number;
  type: string;
  price: number;
}

export interface Booking {
  _id: string;
  userId: string;
  showtimeId: string;
  seats: BookedSeat[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired';
  paymentMethod: string | null;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  bookingCode: string;
  expiresAt: string;
  createdAt: string;
}

export interface CreateBookingParams {
  showtimeId: string;
  seatIds: string[];
}

export interface ConfirmBookingParams {
  paymentId: string;
}

export const bookingsApi = {
  /**
   * Create a new booking
   */
  createBooking: async (params: CreateBookingParams): Promise<Booking> => {
    const response = await apiClient.post('/bookings', params);
    return response.data;
  },

  /**
   * Confirm booking after payment
   */
  confirmBooking: async (bookingId: string, params: ConfirmBookingParams): Promise<Booking> => {
    const response = await apiClient.patch(`/bookings/${bookingId}/confirm`, params);
    return response.data;
  },

  /**
   * Cancel booking
   */
  cancelBooking: async (bookingId: string): Promise<Booking> => {
    const response = await apiClient.delete(`/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Get user bookings
   */
  getMyBookings: async (page = 1, limit = 10): Promise<PaginatedResponse<Booking>> => {
    const response = await apiClient.get('/bookings/my-bookings', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get booking by ID
   */
  getBookingById: async (bookingId: string): Promise<Booking> => {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Get booking by code
   */
  getBookingByCode: async (code: string): Promise<Booking> => {
    const response = await apiClient.get(`/bookings/code/${code}`);
    return response.data;
  },
};
