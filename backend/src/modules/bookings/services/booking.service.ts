/**
 * Booking Service
 * Business logic for booking operations
 */

import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { 
  CreateBookingUseCase, 
  ConfirmBookingUseCase, 
  CancelBookingUseCase 
} from '@/application/use-cases/booking';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly confirmBookingUseCase: ConfirmBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
  ) {}

  /**
   * Create a new booking
   */
  async createBooking(params: {
    userId: string;
    showtimeId: string;
    seatIds: string[];
  }) {
    return this.createBookingUseCase.execute(params);
  }

  /**
   * Confirm booking after payment
   */
  async confirmBooking(bookingId: string, paymentId: string, userId: string) {
    return this.confirmBookingUseCase.execute({ bookingId, paymentId, userId });
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string, userId: string) {
    return this.cancelBookingUseCase.execute({ bookingId, userId });
  }

  /**
   * Get user bookings
   */
  async getUserBookings(userId: string, page: number = 1, limit: number = 10) {
    return this.bookingRepo.findByUserId(userId, page, limit);
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: string) {
    return this.bookingRepo.findById(bookingId);
  }

  /**
   * Get booking by booking code
   */
  async getBookingByCode(code: string) {
    return this.bookingRepo.findByBookingCode(code);
  }

  /**
   * Process expired bookings (should be run periodically)
   */
  async processExpiredBookings() {
    const expiredBookings = await this.bookingRepo.findExpiredBookings();
    
    // Cancel each expired booking
    for (const booking of expiredBookings) {
      try {
        await this.cancelBookingUseCase.execute({
          bookingId: booking._id,
          userId: booking.userId,
        });
      } catch (error) {
        console.error(`Failed to cancel expired booking ${booking._id}:`, error);
      }
    }

    return expiredBookings.length;
  }
}
