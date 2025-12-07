/**
 * Use Case: Confirm Booking
 * Handles booking confirmation after successful payment
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BookingRepository } from '@/modules/bookings/repositories/booking.repository';
import { SeatRepository } from '@/modules/theaters/repositories/seat.repository';

export interface ConfirmBookingInput {
  bookingId: string;
  paymentId: string;
  userId: string;
}

@Injectable()
export class ConfirmBookingUseCase {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly seatRepo: SeatRepository,
  ) {}

  async execute(input: ConfirmBookingInput) {
    const { bookingId, paymentId, userId } = input;

    // 1. Find booking
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // 2. Verify booking belongs to user
    if (booking.userId.toString() !== userId) {
      throw new BadRequestException(
        'You are not authorized to confirm this booking',
      );
    }

    // 3. Check booking status
    if (booking.status !== 'pending') {
      throw new BadRequestException('Booking is not in pending status');
    }

    // 4. Check if booking has expired
    if (new Date() > booking.expiresAt) {
      throw new BadRequestException('Booking has expired');
    }

    // 5. Confirm booking
    const confirmedBooking = await this.bookingRepo.confirmBooking(
      bookingId,
      paymentId,
    );
    if (!confirmedBooking) {
      throw new BadRequestException('Failed to confirm booking');
    }

    // 6. Update seat status from 'reserved' to 'booked'
    const seatIds = booking.seats.map((seat) => seat.seatId.toString());
    await this.seatRepo.bulkUpdateStatus(seatIds, 'booked');

    return confirmedBooking;
  }
}
