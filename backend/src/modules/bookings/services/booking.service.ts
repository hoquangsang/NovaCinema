import { Types } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/modules/users';
import { ShowtimeService } from 'src/modules/showtimes';
import { RoomService, TheaterService } from 'src/modules/theaters';
import { TicketPricingService } from 'src/modules/ticket-pricing';
import { BookingRepository } from '../repositories';
import { BOOKING_STATUSES } from '../constants';
import { BookingSeatService, AvailableSeat } from './booking-seat.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly theaterService: TheaterService,
    private readonly showtimeService: ShowtimeService,
    private readonly ticketPricingService: TicketPricingService,
    private readonly bookingSeatService: BookingSeatService,
  ) {}

  /**
   * Seat type prices by showtime
   */
  public async getSeatTypePrices(showtimeId: string) {
    const showtime = await this.showtimeService.findShowtimeById(showtimeId);
    if (!showtime) throw new NotFoundException('Showtime not found');

    const room = await this.roomService.findRoomById(showtime.roomId);
    if (!room) throw new NotFoundException('Room not found');

    const prices = await this.ticketPricingService.getSeatTypePrices({
      roomType: showtime.roomType,
      effectiveAt: showtime.startAt,
    });

    return {
      COUPLE: prices.COUPLE,
      NORMAL: prices.NORMAL,
      VIP: prices.VIP,
    };
  }

  /**
   * Available seats (seat map)
   */
  public async getAvailableSeats(showtimeId: string, userId: string) {
    const showtime = await this.showtimeService.findShowtimeById(showtimeId);
    if (!showtime) throw new NotFoundException('Showtime not found');

    const room = await this.roomService.findRoomById(showtime.roomId);
    if (!room) throw new NotFoundException('Room not found');

    const seatMap = await this.bookingSeatService.getAvailableSeatMap(
      showtime._id,
      userId,
      room.seatMap,
    );

    return { seatMap };
  }

  /**
   * Create booking + HOLDING seats
   */
  public async createBooking(
    showtimeId: string,
    userId: string,
    selectedSeatCodes: string[],
  ) {
    this.bookingSeatService.assertSelectedSeatCodesValid(selectedSeatCodes);

    const showtime = await this.showtimeService.findShowtimeById(showtimeId);
    if (!showtime) throw new NotFoundException('Showtime not found');

    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    const room = await this.roomService.findRoomById(showtime.roomId);
    if (!room) throw new NotFoundException('Room not found');

    const availableSeatMap = await this.bookingSeatService.getAvailableSeatMap(
      showtime._id,
      user._id,
      room.seatMap,
    );

    this.bookingSeatService.assertSeatsAvailable(
      availableSeatMap,
      selectedSeatCodes,
    );

    this.bookingSeatService.assertNoOrphanSeats(
      availableSeatMap,
      selectedSeatCodes,
    );

    const { insertedItem: booking } =
      await this.bookingRepository.command.createOne({
        data: {
          userId: new Types.ObjectId(user._id),
          showtimeId: new Types.ObjectId(showtime._id),
          status: BOOKING_STATUSES.PENDING,
        },
      });

    if (!booking) {
      throw new BadRequestException('Booking creation failed');
    }

    /**
     * Create logical selected seats (1 seatCode = 1 record)
     */
    const selectedSeats: AvailableSeat[] = [];

    const logicalSeats = new Map<string, AvailableSeat>();
    for (const row of availableSeatMap) {
      for (const seat of row) {
        if (!seat) continue;
        if (!logicalSeats.has(seat.seatCode)) {
          logicalSeats.set(seat.seatCode, seat);
        }
      }
    }

    for (const code of selectedSeatCodes) {
      const seat = logicalSeats.get(code);
      if (!seat) {
        throw new BadRequestException(`Seat ${code} not found`);
      }
      selectedSeats.push(seat);
    }

    await this.bookingSeatService.createHoldingSeats(
      booking._id,
      user._id,
      showtime._id,
      room._id,
      selectedSeats,
    );

    return {
      _id: booking._id,
      userId: booking.userId,
      showtimeId: booking.showtimeId,
      status: booking.status,
      seatCodes: selectedSeatCodes,
    };
  }
}
