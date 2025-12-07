/**
 * Use Case: Create Booking
 * Implements the business logic for creating a new booking
 * This follows the Use Case pattern from Clean Architecture
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { BookingRepository } from '@/modules/bookings/repositories/booking.repository';
import { ShowtimeRepository } from '@/modules/showtimes/repositories/showtime.repository';
import { SeatRepository } from '@/modules/theaters/repositories/seat.repository';

export interface CreateBookingInput {
  userId: string;
  showtimeId: string;
  seatIds: string[];
}

@Injectable()
export class CreateBookingUseCase {
  // Default booking expiration: 15 minutes
  private readonly BOOKING_EXPIRATION_MINUTES = 15;

  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly showtimeRepo: ShowtimeRepository,
    private readonly seatRepo: SeatRepository,
  ) {}

  async execute(input: CreateBookingInput) {
    const { userId, showtimeId, seatIds } = input;

    // Validate input
    if (!seatIds || seatIds.length === 0) {
      throw new BadRequestException('At least one seat must be selected');
    }

    // 1. Verify showtime exists and is bookable
    const showtime = await this.showtimeRepo.findById(showtimeId);
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }

    // Check if showtime is bookable
    const now = new Date();
    if (showtime.status !== 'scheduled') {
      throw new BadRequestException('Showtime is not available for booking');
    }

    if (showtime.startTime <= now) {
      throw new BadRequestException('Cannot book tickets for past showtimes');
    }

    // Check booking window (15 minutes before start)
    const bookingDeadline = new Date(showtime.startTime);
    bookingDeadline.setMinutes(bookingDeadline.getMinutes() - 15);
    if (now >= bookingDeadline) {
      throw new BadRequestException('Booking window has closed');
    }

    // 2. Verify seats exist and are available
    const seats = await this.seatRepo.findByIds(seatIds);
    if (seats.length !== seatIds.length) {
      throw new NotFoundException('Some seats were not found');
    }

    // Check if all seats belong to the correct room
    const allSeatsInRoom = seats.every(
      (seat) => seat.roomId.toString() === showtime.roomId.toString(),
    );
    if (!allSeatsInRoom) {
      throw new BadRequestException(
        'Selected seats do not belong to the showtime room',
      );
    }

    // Check if all seats are available
    const unavailableSeats = seats.filter(
      (seat) => seat.status !== 'available',
    );
    if (unavailableSeats.length > 0) {
      throw new ConflictException(
        'Some selected seats are no longer available',
      );
    }

    // Check if enough seats are available in showtime
    if (showtime.availableSeats < seatIds.length) {
      throw new ConflictException(
        'Not enough available seats for this showtime',
      );
    }

    // 3. Calculate total amount
    const totalAmount = this.calculateTotalAmount(seats, showtime.basePrice);

    // 4. Generate booking code
    const bookingCode = await this.bookingRepo.generateBookingCode();

    // 5. Set expiration time
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() + this.BOOKING_EXPIRATION_MINUTES,
    );

    // 6. Create booking
    const bookedSeats = seats.map((seat) => ({
      seatId: seat._id,
      row: String(seat.row),
      number: seat.number,
      type: seat.type as string,
      price: this.calculateSeatPrice(seat.type as string, showtime.basePrice),
    }));

    const booking = await this.bookingRepo.create({
      userId,
      showtimeId,
      seats: bookedSeats,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: null,
      paymentId: null,
      bookingCode,
      expiresAt,
      confirmedAt: null,
      cancelledAt: null,
    } as any);

    // 7. Reserve seats (update seat status)
    await this.seatRepo.bulkUpdateStatus(seatIds, 'reserved');

    // 8. Update showtime available seats
    await this.showtimeRepo.updateAvailableSeats(showtimeId, seatIds.length);

    return booking;
  }

  /**
   * Calculate seat price based on type
   */
  private calculateSeatPrice(seatType: string, basePrice: number): number {
    const priceMultipliers = {
      standard: 1.0,
      vip: 1.5,
      couple: 2.0,
    };

    const multiplier = priceMultipliers[seatType] || 1.0;
    return basePrice * multiplier;
  }

  /**
   * Calculate total booking amount
   */
  private calculateTotalAmount(seats: any[], basePrice: number): number {
    return seats.reduce((total, seat) => {
      return total + this.calculateSeatPrice(seat.type, basePrice);
    }, 0);
  }
}
