/**
 * Use Case: Cancel Booking
 * Handles booking cancellation and seat release
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BookingRepository } from '@/modules/bookings/repositories/booking.repository';
import { ShowtimeRepository } from '@/modules/showtimes/repositories/showtime.repository';
import { SeatRepository } from '@/modules/theaters/repositories/seat.repository';

export interface CancelBookingInput {
  bookingId: string;
  userId: string;
}

@Injectable()
export class CancelBookingUseCase {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly showtimeRepo: ShowtimeRepository,
    private readonly seatRepo: SeatRepository,
  ) {}

  async execute(input: CancelBookingInput) {
    const { bookingId, userId } = input;

    // 1. Find booking
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // 2. Verify booking belongs to user
    if (booking.userId !== userId) {
      throw new BadRequestException('You are not authorized to cancel this booking');
    }

    // 3. Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === 'expired') {
      throw new BadRequestException('Cannot cancel expired booking');
    }

    // 4. Check cancellation policy
    const showtime = await this.showtimeRepo.findById(booking.showtimeId);
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }

    const now = new Date();
    const hoursUntilShowtime = (showtime.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Must cancel at least 2 hours before showtime
    if (hoursUntilShowtime < 2) {
      throw new BadRequestException('Cannot cancel booking less than 2 hours before showtime');
    }

    // 5. Cancel booking
    const cancelledBooking = await this.bookingRepo.cancelBooking(bookingId);
    if (!cancelledBooking) {
      throw new BadRequestException('Failed to cancel booking');
    }

    // 6. Release seats (make them available again)
    const seatIds = booking.seats.map(seat => seat.seatId);
    await this.seatRepo.bulkUpdateStatus(seatIds, 'available');

    // 7. Update showtime available seats
    await this.showtimeRepo.updateAvailableSeats(
      booking.showtimeId,
      -booking.seats.length, // Increment back
    );

    return {
      booking: cancelledBooking,
      refundAmount: this.calculateRefundAmount(booking.totalAmount, hoursUntilShowtime),
    };
  }

  /**
   * Calculate refund amount based on cancellation time
   */
  private calculateRefundAmount(totalAmount: number, hoursUntilShowtime: number): number {
    if (hoursUntilShowtime >= 24) {
      return totalAmount; // 100% refund
    } else if (hoursUntilShowtime >= 2) {
      return totalAmount * 0.5; // 50% refund
    }
    return 0; // No refund
  }
}
