import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/modules/users';
import { Showtime, ShowtimeDocument } from 'src/modules/showtimes';
import { SeatType } from 'src/modules/theaters/types';
import { SEAT_TYPES } from 'src/modules/theaters/constants';
import { Theater, TheaterDocument } from 'src/modules/theaters/schemas';
import { Room, RoomDocument, Seat } from 'src/modules/theaters/schemas';
import { BOOKING_STATUSES } from 'src/modules/bookings/constants';
import { BookingStatus } from 'src/modules/bookings/types';
import { Booking, BookingDocument } from 'src/modules/bookings/schemas';
import {
  PAYMENT_STATUSES,
  PaymentStatus,
} from 'src/modules/payments/constants';
import { Payment, PaymentDocument } from 'src/modules/payments/schemas';
import { TICKET_STATUSES } from 'src/modules/tickets/constants';
import { Ticket, TicketDocument } from 'src/modules/tickets/schemas';
import { randomFloat, randomInt, shuffle } from './booking-seeder.helper';

const SEAT_PRICES: Record<SeatType, number> = {
  [SEAT_TYPES.NORMAL]: 50_000,
  [SEAT_TYPES.VIP]: 90_000,
  [SEAT_TYPES.COUPLE]: 110_000,
};

@Injectable()
export class BookingSeederService {
  private readonly logger = new Logger(BookingSeederService.name);

  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Showtime.name)
    private readonly showtimeModel: Model<ShowtimeDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Theater.name)
    private readonly theaterModel: Model<TheaterDocument>,
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
  ) {}

  async seed() {
    await this.bookingModel.deleteMany({});
    await this.paymentModel.deleteMany({});
    await this.ticketModel.deleteMany({});

    const users = await this.userModel.find({ emailVerified: true });
    this.logger.log(`Users=${users.length}`);

    const theaters = await this.theaterModel.find();
    this.logger.log(`Theaters=${theaters.length}\n`);

    if (!users.length || !theaters.length) {
      this.logger.warn('No users or theaters found');
      return;
    }

    // Partition users equally across theaters
    const userGroups: UserDocument[][] = [];
    for (let i = 0; i < theaters.length; i++) userGroups.push([]);
    users.forEach((user, i) => userGroups[i % theaters.length].push(user));

    this.logger.log(
      `Processing ${theaters.length} theaters with ~${Math.floor(users.length / theaters.length)} users each`,
    );

    // Seed each theater
    for (let i = 0; i < theaters.length; i++) {
      this.logger.log(
        `[${i + 1}/${theaters.length}] ${theaters[i].theaterName}`,
      );
      await this.seedForTheater(theaters[i], userGroups[i]);
    }

    this.logger.log('✅ Booking seeding completed.\n');
  }

  async seedForTheater(
    theater: TheaterDocument,
    users: UserDocument[],
  ): Promise<void> {
    // Load all showtimes for this theater
    const showtimes = await this.showtimeModel
      .find({ theaterId: theater._id })
      .sort({ startAt: 'asc' });

    if (!showtimes.length) return;

    // Seed bookings
    const bookings = await this.seedBookingsForTheater(showtimes, users);
    this.logger.log(`  ├─ Bookings: ${bookings.length}`);

    // Seed payments
    const payments = await this.seedPaymentsForTheater(bookings);
    this.logger.log(`  ├─ Payments: ${payments.length}`);

    // Seed tickets
    const tickets = await this.seedTicketsForTheater(bookings);
    this.logger.log(`  └─ Tickets:  ${tickets.length}\n`);
  }

  private async seedBookingsForTheater(
    showtimes: ShowtimeDocument[],
    users: UserDocument[],
  ): Promise<BookingDocument[]> {
    // Load all rooms for these showtimes
    const roomIds = [...new Set(showtimes.map((s) => s.roomId.toString()))];
    const rooms = await this.roomModel.find({ _id: { $in: roomIds } });
    const roomMap = new Map(rooms.map((r) => [r._id.toString(), r]));

    // Calculate time range for fill rate
    const oldest = showtimes[0].startAt.getTime();
    const newest = showtimes[showtimes.length - 1].startAt.getTime();
    const range = newest - oldest;

    const bookings: Partial<Booking>[] = [];

    // Generate bookings for each showtime
    for (const showtime of showtimes) {
      const room = roomMap.get(showtime.roomId.toString());
      if (!room) continue;

      const fillRate =
        range === 0
          ? 0.3
          : Math.max(
              0,
              0.3 * (1 - (showtime.startAt.getTime() - oldest) / range),
            );

      const seats = this.extractSeats(room.seatMap);
      shuffle(seats);

      const confirmedRate = Math.floor(room.capacity * fillRate);
      const failedRate = Math.floor(confirmedRate * randomFloat(0.1, 0.3));

      let index = 0;

      // Confirmed bookings
      for (
        let consumed = 0;
        consumed < confirmedRate && index < seats.length;

      ) {
        const user = users[randomInt(0, users.length - 1)];
        const count = randomInt(1, 4);
        const picked = seats.slice(index, index + count);
        if (!picked.length) break;

        bookings.push(
          this.createBooking(
            user,
            showtime,
            picked,
            BOOKING_STATUSES.CONFIRMED,
          ),
        );

        consumed += picked.length;
        index += picked.length;
      }

      // Failed bookings (can overlap seats)
      const failedPool = seats.slice(
        0,
        Math.floor(seats.length * randomFloat(0.1, 0.2)),
      );
      shuffle(failedPool);

      for (
        let i = 0, consumed = 0;
        consumed < failedRate && i < failedPool.length;

      ) {
        const user = users[randomInt(0, users.length - 1)];
        const count = randomInt(1, 4);
        const picked = failedPool.slice(i, i + count);
        if (!picked.length) break;

        const isCancelled = Math.random() < 0.5;
        const status = isCancelled
          ? BOOKING_STATUSES.CANCELLED
          : BOOKING_STATUSES.EXPIRED;

        bookings.push(
          this.createBooking(user, showtime, picked, status),
        );

        consumed += picked.length;
        i += picked.length;
      }
    }

    // Insert bookings for this theater
    if (bookings.length) {
      return await this.bookingModel.insertMany(bookings, { ordered: false });
    }
    return [];
  }

  private createBooking(
    user: UserDocument,
    showtime: ShowtimeDocument,
    seats: Seat[],
    status: BookingStatus,
  ): Partial<Booking> {
    const bookingSeats = seats.map((s) => ({
      seatCode: s.seatCode,
      seatType: s.seatType,
      unitPrice: SEAT_PRICES[s.seatType],
    }));

    const baseAmount = bookingSeats.reduce(
      (sum, seat) => sum + seat.unitPrice,
      0,
    );

    // CONFIRMED: 1-30 days before showtime
    // CANCELLED/EXPIRED: 1-7 days before showtime (failed earlier)
    const daysBeforeShowtime =
      status === BOOKING_STATUSES.CONFIRMED
        ? randomInt(1, 30)
        : randomInt(1, 7);

    const createdAt = new Date(
      showtime.startAt.getTime() - daysBeforeShowtime * 24 * 60 * 60 * 1000,
    );

    // CONFIRMED or CANCELLED: no expiration
    const expiresAt =
      status === BOOKING_STATUSES.EXPIRED
        ? new Date(createdAt.getTime() + 5 * 60 * 1000)
        : null;

    return {
      userId: user._id,
      showtimeId: showtime._id,
      roomType: showtime.roomType,
      startAt: showtime.startAt,
      status,
      expiresAt,
      seats: bookingSeats,
      baseAmount,
      discountAmount: 0,
      finalAmount: baseAmount,
      username: user.username,
      movieTitle: showtime.movieTitle,
      theaterName: showtime.theaterName,
      roomName: showtime.roomName,
      createdAt,
      updatedAt: createdAt,
    };
  }

  private extractSeats(seatMap: (Seat | null)[][]): Seat[] {
    const seats: Seat[] = [];

    for (let r = 0; r < seatMap.length; r++) {
      for (let c = 0; c < seatMap[r].length; c++) {
        const seat = seatMap[r][c];
        if (!seat || seat.isActive === false) continue;

        seats.push(seat);

        if (seat.seatType === SEAT_TYPES.COUPLE) c++;
      }
    }

    return seats;
  }

  private async seedPaymentsForTheater(
    bookings: BookingDocument[],
  ): Promise<PaymentDocument[]> {
    const payments: Partial<Payment>[] = [];

    for (const booking of bookings) {
      let paymentStatus: PaymentStatus;

      if (booking.status === BOOKING_STATUSES.CONFIRMED) {
        paymentStatus = PAYMENT_STATUSES.PAID;
      } else if (booking.status === BOOKING_STATUSES.CANCELLED) {
        paymentStatus = PAYMENT_STATUSES.CANCELLED;
      } else if (booking.status === BOOKING_STATUSES.EXPIRED) {
        paymentStatus =
          Math.random() < 0.8
            ? PAYMENT_STATUSES.CANCELLED
            : PAYMENT_STATUSES.EXPIRED;
      } else {
        continue;
      }

      const orderCode = `${Date.now()}${randomInt(1000, 9999)}`;
      const transactionId =
        paymentStatus === PAYMENT_STATUSES.PAID
          ? `${Date.now()}${randomInt(10000, 99999)}`
          : undefined;

      const transactionAt =
        paymentStatus === PAYMENT_STATUSES.PAID
          ? new Date(booking.createdAt!.getTime() + randomInt(60000, 3600000)) // 1-60 minutes
          : undefined;

      payments.push({
        bookingId: booking._id,
        userId: booking.userId,
        orderCode,
        amount: booking.finalAmount,
        status: paymentStatus,
        expiresAt: booking.expiresAt || null,
        provider: 'PAYOS',
        transactionId,
        transactionAt,
      });
    }

    if (payments.length) {
      return await this.paymentModel.insertMany(payments, { ordered: false });
    }
    return [];
  }

  private async seedTicketsForTheater(
    bookings: BookingDocument[],
  ): Promise<TicketDocument[]> {
    const tickets: Partial<Ticket>[] = [];

    for (const booking of bookings) {
      // Only create tickets for CONFIRMED bookings
      if (booking.status !== BOOKING_STATUSES.CONFIRMED) continue;

      // Create one ticket per seat
      for (const seat of booking.seats) {
        const code = this.generateTicketCode();

        tickets.push({
          bookingId: booking._id,
          showtimeId: booking.showtimeId,
          userId: booking.userId,
          code,
          status: TICKET_STATUSES.VALID,
          scannedAt: undefined,
          startAt: booking.startAt,
          movieTitle: booking.movieTitle,
          moviePoster: undefined,
          theaterName: booking.theaterName,
          roomName: booking.roomName,
          roomType: booking.roomType,
          seatType: seat.seatType,
          seatCode: seat.seatCode,
          unitPrice: seat.unitPrice,
        });
      }
    }

    if (tickets.length) {
      return await this.ticketModel.insertMany(tickets, { ordered: false });
    }
    return [];
  }

  generateTicketCode(): string {
    return new Types.ObjectId().toHexString().toUpperCase();
  }
}
