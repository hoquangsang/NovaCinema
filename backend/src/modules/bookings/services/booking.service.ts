import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DateUtil } from 'src/common/utils';
import { UserService } from 'src/modules/users';
import { ShowtimeService } from 'src/modules/showtimes';
import { RoomService, SeatService } from 'src/modules/theaters';
import { PricingConfigService } from 'src/modules/pricing-configs';
import { RoomType, SeatType } from 'src/modules/theaters/types';
import {
  BOOKING_EXPIRE_MINUTES,
  BOOKING_LIMITS,
  BOOKING_SEAT_STATUSES,
  BOOKING_STATUSES,
} from '../constants';
import { BookingSeatStatus, BookingStatus } from '../types';
import { BookingRepository } from '../repositories';
import { BookingSeat } from '../schemas';

type Seat = {
  seatCode: string;
  seatType: SeatType;
};
type SeatMap = (Seat | null)[][];

type SeatAvailability = Seat & {
  status: BookingSeatStatus;
  isAvailable: boolean;
};
type SeatAvailabilityMap = (SeatAvailability | null)[][];

@Injectable()
export class BookingService {
  public constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly userService: UserService,
    private readonly seatService: SeatService,
    private readonly roomService: RoomService,
    private readonly showtimeService: ShowtimeService,
    private readonly ticketPricingService: PricingConfigService,
  ) {
    //
  }
  //
  public async findBookingById(bookingId: string) {
    return await this.bookingRepository.query.findOneById({
      id: bookingId,
    });
  }

  public async getBookingAvailability(showtimeId: string) {
    const showtime = await this.showtimeService.findShowtimeById(showtimeId);
    if (!showtime) throw new NotFoundException('Showtime not found');

    const seatTypePrices = await this.resolveSeatTypePrices(showtime);
    const prices = Object.entries(seatTypePrices).map(([seatType, price]) => ({
      seatType,
      price,
    }));

    const seatMap = await this.roomService.getSeatMapByRoomId(showtime.roomId);
    const bookings = await this.findBlockingBookingsByShowtimeId(showtime._id);
    const availabilitySeatMap = this.buildSeatAvailabilityMap(
      seatMap,
      bookings,
    );

    return {
      seatMap: availabilitySeatMap,
      prices: prices,
    };
  }

  /** */
  public async createBooking(
    showtimeId: string,
    userId: string,
    selectedSeats: string[],
  ) {
    const selectedSet = this.validateAndBuildSelectedSeatSet(selectedSeats);

    const showtime =
      await this.showtimeService.findShowtimeDetailById(showtimeId);
    if (!showtime) throw new NotFoundException('Showtime not found');

    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    const rawSeatMap = await this.roomService.getSeatMapByRoomId(
      showtime.room._id,
    );

    //
    const blockings = await this.findBlockingBookingsByShowtimeId(showtime._id);
    const seatMap = this.buildSeatAvailabilityMap(rawSeatMap, blockings);

    //
    const seatMapIndex = this.buildSeatAvailabilityIndexByCode(seatMap);
    this.validateSeatsAvailability(seatMapIndex, selectedSet);
    this.validateOrphanRule(seatMap, selectedSet);

    //
    const seatTypePrices = await this.resolveSeatTypePrices({
      roomType: showtime.room.roomType,
      startAt: showtime.startAt,
    });

    const { bookingSeats, baseAmount } = selectedSeats.reduce(
      (acc, seatCode) => {
        const seat = seatMapIndex.get(seatCode);
        if (!seat) {
          throw new BadRequestException(`Seat not found: ${seatCode}`);
        }

        const unitPrice = seatTypePrices[seat.seatType];
        if (unitPrice == null) {
          throw new InternalServerErrorException(
            `Missing price for seat type: ${seat.seatType}`,
          );
        }

        acc.bookingSeats.push({
          seatCode: seat.seatCode,
          seatType: seat.seatType,
          unitPrice,
        });

        acc.baseAmount += unitPrice;
        return acc;
      },
      { bookingSeats: [] as BookingSeat[], baseAmount: 0 },
    );

    const discountAmount = 0; // TODO: membership + voucher
    const finalAmount = baseAmount - discountAmount;

    const expiresAt = DateUtil.add(DateUtil.nowUTC(), {
      minute: BOOKING_EXPIRE_MINUTES.DRAFT,
    });

    try {
      const { insertedItem: created } =
        await this.bookingRepository.command.createOne({
          data: {
            userId: user._id,
            showtimeId: showtime._id,
            status: BOOKING_STATUSES.DRAFT,
            expiresAt: expiresAt,
            seats: bookingSeats,

            baseAmount: baseAmount,
            discountAmount: discountAmount,
            finalAmount: finalAmount,

            // --- TODO ---
            // membershipId
            // membershipDiscountAmount
            // membershipTier

            // voucherId
            // voucherDiscountAmount
            // voucherCode

            // --- Snapshot ---
            username: user.username,
            movieTitle: showtime.movie.title,
            theaterName: showtime.theater.theaterName,
            roomName: showtime.room.roomName,
            roomType: showtime.room.roomType,
            startAt: showtime.startAt,
          },
        });

      return created;
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Booking create conflict');
      }
      throw new InternalServerErrorException();
    }
  }

  /** */
  private async findBlockingBookingsByShowtimeId(showtimeId: string) {
    const now = DateUtil.nowUTC();
    return this.bookingRepository.query.findMany({
      filter: {
        showtimeId,
        $or: [
          { status: BOOKING_STATUSES.CONFIRMED },
          { status: BOOKING_STATUSES.PENDING_PAYMENT, expiresAt: { $gt: now } },
          { status: BOOKING_STATUSES.DRAFT, expiresAt: { $gt: now } },
          //EXPIRED / CANCELLED = non-blocking
        ],
      },
      inclusion: {
        userId: true,
        status: true,
        seats: true,
      },
    });
  }

  /** */
  public async markBookingPendingPayment(bookingId: string) {
    const now = DateUtil.nowUTC();

    const booking = await this.bookingRepository.query.findOne({
      filter: {
        _id: bookingId,
      },
      inclusion: {
        status: true,
        expiresAt: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BOOKING_STATUSES.DRAFT) {
      throw new BadRequestException('Booking is not in DRAFT state');
    }

    if (!booking.expiresAt || booking.expiresAt <= now) {
      throw new BadRequestException('Booking already expired');
    }

    try {
      const { modifiedItem: updated } =
        await this.bookingRepository.command.updateOne({
          filter: {
            _id: bookingId,
            status: BOOKING_STATUSES.DRAFT,
          },
          update: {
            status: BOOKING_STATUSES.PENDING_PAYMENT,
            expiresAt: null,
          },
        });

      if (!updated) {
        throw new ConflictException(
          'Booking status has changed. Please refresh and try again',
        );
      }

      return updated;
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Booking status update conflict');
      }
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  public async markBookingConfirmed(bookingId: string) {
    const booking = await this.bookingRepository.query.findOne({
      filter: {
        _id: bookingId,
      },
      inclusion: {
        status: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BOOKING_STATUSES.PENDING_PAYMENT) {
      throw new BadRequestException('Booking is not in PENDING_PAYMENT state');
    }

    try {
      const { modifiedItem: updated } =
        await this.bookingRepository.command.updateOne({
          filter: {
            _id: bookingId,
            status: BOOKING_STATUSES.PENDING_PAYMENT,
          },
          update: {
            status: BOOKING_STATUSES.CONFIRMED,
            expiresAt: null,
          },
        });

      if (!updated) {
        throw new ConflictException(
          'Booking status has changed. Please refresh and try again',
        );
      }

      return updated;
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Booking status update conflict');
      }
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  public async markBookingCancelled(bookingId: string) {
    const booking = await this.bookingRepository.query.findOne({
      filter: {
        _id: bookingId,
      },
      inclusion: {
        status: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BOOKING_STATUSES.PENDING_PAYMENT) {
      throw new BadRequestException('Booking is not in PENDING_PAYMENT state');
    }

    try {
      const { modifiedItem: updated } =
        await this.bookingRepository.command.updateOne({
          filter: {
            _id: bookingId,
            status: BOOKING_STATUSES.PENDING_PAYMENT,
          },
          update: {
            status: BOOKING_STATUSES.CANCELLED,
            expiresAt: null,
          },
        });

      if (!updated) {
        throw new ConflictException(
          'Booking status has changed. Please refresh and try again',
        );
      }

      return updated;
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Booking status update conflict');
      }
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  public async markBookingExpired(bookingId: string) {
    const booking = await this.bookingRepository.query.findOne({
      filter: {
        _id: bookingId,
      },
      inclusion: {
        status: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BOOKING_STATUSES.PENDING_PAYMENT) {
      throw new BadRequestException('Booking is not in PENDING_PAYMENT state');
    }

    try {
      const { modifiedItem: updated } =
        await this.bookingRepository.command.updateOne({
          filter: {
            _id: bookingId,
            status: BOOKING_STATUSES.PENDING_PAYMENT,
          },
          update: {
            status: BOOKING_STATUSES.EXPIRED,
            expiresAt: null,
          },
        });

      if (!updated) {
        throw new ConflictException(
          'Booking status has changed. Please refresh and try again',
        );
      }

      return updated;
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Booking status update conflict');
      }
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  // seat type prices
  private async resolveSeatTypePrices(showtime: {
    roomType: RoomType;
    startAt: Date;
  }): Promise<Record<SeatType, number>> {
    const { roomType, startAt } = showtime;
    const prices: Record<SeatType, number> =
      await this.ticketPricingService.getSeatTypePrices({
        roomType: roomType,
        effectiveAt: startAt,
      });

    return prices;
  }

  // build seat map
  private buildSeatAvailabilityMap(
    seatMap: SeatMap,
    bookings: {
      userId: string;
      status: BookingStatus;
      seats: { seatCode: string }[];
    }[],
  ): SeatAvailabilityMap {
    const seatStatusMap = new Map<string, BookingSeatStatus>();

    for (const booking of bookings) {
      let seatStatus: BookingSeatStatus;

      if (booking.status === BOOKING_STATUSES.CONFIRMED) {
        seatStatus = BOOKING_SEAT_STATUSES.SOLD;
      } else {
        // PENDING_PAYMENT hoặc DRAFT còn hạn
        seatStatus = BOOKING_SEAT_STATUSES.RESERVED;
      }

      for (const seat of booking.seats) {
        const existing = seatStatusMap.get(seat.seatCode);
        if (existing === BOOKING_SEAT_STATUSES.SOLD) continue;

        seatStatusMap.set(seat.seatCode, seatStatus);
      }
    }

    return seatMap.map((row) =>
      row.map((seat) => {
        if (!seat) return null;
        const status =
          seatStatusMap.get(seat.seatCode) ?? BOOKING_SEAT_STATUSES.AVAILABLE;

        return {
          seatCode: seat.seatCode,
          seatType: seat.seatType,
          status,
          isAvailable: status === BOOKING_SEAT_STATUSES.AVAILABLE,
        };
      }),
    );
  }

  private buildSeatAvailabilityIndexByCode(
    seatMap: SeatAvailabilityMap,
  ): Map<string, SeatAvailability> {
    return seatMap.reduce((map, row) => {
      row.forEach((seat) => {
        if (seat) map.set(seat.seatCode, seat);
      });
      return map;
    }, new Map<string, SeatAvailability>());
  }

  // check input and build
  private validateAndBuildSelectedSeatSet(selectedSeats: string[]) {
    if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      throw new BadRequestException('No seats selected');
    }

    if (selectedSeats.length > BOOKING_LIMITS.MAX_SEATS_PER_BOOKING) {
      throw new BadRequestException(
        `Maximum ${BOOKING_LIMITS.MAX_SEATS_PER_BOOKING} seats allowed per booking`,
      );
    }

    const seen = new Set<string>();
    for (const seatCode of selectedSeats) {
      if (!this.seatService.isValidSeatCode(seatCode)) {
        throw new BadRequestException(`Invalid seat code: ${seatCode}`);
      }

      if (seen.has(seatCode)) {
        throw new BadRequestException(`Duplicate seat selected: ${seatCode}`);
      }

      seen.add(seatCode);
    }

    return seen;
  }

  // Check orphan
  private validateSeatsAvailability(
    seatMapIndex: Map<string, SeatAvailability>,
    selectedSet: Set<string>,
  ) {
    for (const seatCode of selectedSet) {
      const seat = seatMapIndex.get(seatCode);
      if (!seat) {
        throw new BadRequestException(
          `Invalid seat selection: seat does not exist (${seatCode})`,
        );
      }
      if (!seat.isAvailable) {
        throw new BadRequestException(
          `Invalid seat selection: seat is already booked (${seatCode})`,
        );
      }
    }
  }

  private validateOrphanRule(
    seatMap: SeatAvailabilityMap,
    selectedSet: Set<string>,
  ) {
    for (const row of seatMap) {
      this.validateRow(row, selectedSet);
    }
  }

  private validateRow(
    row: (SeatAvailability | null)[],
    selectedSet: Set<string>,
  ) {
    let segment: SeatAvailability[] = [];
    let leftBoundary: 'HARD' | 'SOFT' = 'SOFT';

    const flush = (rightBoundary: 'HARD' | 'SOFT') => {
      if (segment.length > 0) {
        this.validateSegment(segment, leftBoundary, rightBoundary, selectedSet);
        segment = [];
      }
    };

    for (const seat of row) {
      if (seat === null) {
        flush('SOFT');
        leftBoundary = 'SOFT';
        continue;
      }

      if (!seat.isAvailable || seat.seatType !== 'NORMAL') {
        flush('HARD');
        leftBoundary = 'HARD';
        continue;
      }

      segment.push(seat);
    }

    flush('SOFT');
  }

  private validateSegment(
    segment: SeatAvailability[],
    leftBoundary: 'HARD' | 'SOFT',
    rightBoundary: 'HARD' | 'SOFT',
    selectedSet: Set<string>,
  ) {
    if (segment.length <= 2) return;

    const selectedIndexes = segment
      .map((s, i) => (selectedSet.has(s.seatCode) ? i : -1))
      .filter((i) => i !== -1);

    if (selectedIndexes.length === 0) return;

    // Rule 1: must be consecutive
    for (let i = 1; i < selectedIndexes.length; i++) {
      if (selectedIndexes[i] !== selectedIndexes[i - 1] + 1) {
        throw new BadRequestException(
          'Selected seats must be consecutive within the same segment',
        );
      }
    }

    const first = selectedIndexes[0];
    const last = selectedIndexes[selectedIndexes.length - 1];

    // ===== HARD LEFT =====
    if (leftBoundary === 'HARD') {
      let emptyCount = 0;
      for (let i = 0; i < first; i++) {
        emptyCount++;
      }

      if (emptyCount === 1) {
        throw new BadRequestException(
          `Seat ${segment[0].seatCode} would be left empty next to a hard boundary`,
        );
      }
    }

    // ===== HARD RIGHT =====
    if (rightBoundary === 'HARD') {
      let emptyCount = 0;
      for (let i = segment.length - 1; i > last; i--) {
        emptyCount++;
      }

      if (emptyCount === 1) {
        throw new BadRequestException(
          `Seat ${segment[segment.length - 1].seatCode} would be left empty next to a hard boundary`,
        );
      }
    }
  }
}
