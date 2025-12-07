/**
 * Domain Service Interfaces
 * Define contracts for business logic services
 */

import { Booking, Showtime } from '../models';

/**
 * Booking Service Interface
 * Handles complex booking business logic
 */
export interface IBookingService {
  /**
   * Create a new booking with seat reservation
   */
  createBooking(params: {
    userId: string;
    showtimeId: string;
    seatIds: string[];
  }): Promise<Booking>;

  /**
   * Confirm booking after successful payment
   */
  confirmBooking(bookingId: string, paymentId: string): Promise<Booking>;

  /**
   * Cancel booking and release seats
   */
  cancelBooking(bookingId: string, userId: string): Promise<Booking>;

  /**
   * Process expired bookings (release seats)
   */
  processExpiredBookings(): Promise<number>;

  /**
   * Calculate booking price
   */
  calculateBookingPrice(showtimeId: string, seatIds: string[]): Promise<number>;
}

/**
 * Showtime Service Interface
 * Handles showtime management
 */
export interface IShowtimeService {
  /**
   * Create multiple showtimes for a movie
   */
  createShowtimes(params: {
    movieId: string;
    roomId: string;
    dates: Date[];
  }): Promise<Showtime[]>;

  /**
   * Get available showtimes for a movie at a theater
   */
  getAvailableShowtimes(movieId: string, theaterId: string, date: Date): Promise<Showtime[]>;

  /**
   * Update showtime status
   */
  updateShowtimeStatus(showtimeId: string, status: string): Promise<Showtime>;
}

/**
 * Payment Service Interface
 * Handles payment processing (can be implemented with different providers)
 */
export interface IPaymentService {
  /**
   * Create payment intent
   */
  createPaymentIntent(amount: number, bookingId: string): Promise<{
    paymentId: string;
    clientSecret: string;
  }>;

  /**
   * Verify payment status
   */
  verifyPayment(paymentId: string): Promise<boolean>;

  /**
   * Process refund
   */
  processRefund(paymentId: string, amount: number): Promise<boolean>;
}

/**
 * Email Service Interface
 */
export interface IEmailService {
  sendBookingConfirmation(to: string, booking: Booking): Promise<void>;
  sendBookingCancellation(to: string, booking: Booking): Promise<void>;
  sendOTP(to: string, otp: string): Promise<void>;
}
