import { Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DateUtil } from 'src/common/utils';
import { Seat, SeatMap } from 'src/modules/theaters';
import { SeatService } from 'src/modules/theaters';
import {
  BOOKING_LIMITS,
  BOOKING_SEAT_STATES,
  BOOKING_SEAT_STATUSES,
  BOOKING_TIMINGS,
} from '../constants';
import { BookingSeatState } from '../types';
import { toSeatState } from '../helpers';
import { BookingSeat } from '../schemas';
import { BookingSeatRepository } from '../repositories';

export type AvailableSeat = Seat & {
  state: BookingSeatState;
  isMine: boolean;
  isAvailable: boolean;
};

export type AvailableSeatMap = (AvailableSeat | null)[][];

@Injectable()
export class BookingSeatService {
  constructor(
    private readonly bookingSeatRepository: BookingSeatRepository,
    private readonly seatService: SeatService,
  ) {}

  /** HOLDING expired */
  public isExpired(bookingSeat: BookingSeat) {
    if (
      bookingSeat.status !== BOOKING_SEAT_STATUSES.HOLDING ||
      !bookingSeat.expiresAt
    ) {
      return false;
    }
    return bookingSeat.expiresAt <= DateUtil.nowUTC();
  }

  /**
   * Build available seat map
   * - state calculated per seatCode
   * - COUPLE cells share same logical state
   */
  public async getAvailableSeatMap(
    showtimeId: string,
    userId: string,
    seatMap: SeatMap,
  ): Promise<AvailableSeatMap> {
    const bookingSeats = await this.bookingSeatRepository.query.findMany({
      filter: {
        showtimeId: showtimeId,
        $or: [
          { status: BOOKING_SEAT_STATUSES.SOLD },
          {
            status: BOOKING_SEAT_STATUSES.HOLDING,
            expiresAt: { $gt: DateUtil.nowUTC() },
          },
        ],
      },
    });
    console.log(bookingSeats);

    const bookingSeatByCode = new Map(bookingSeats.map((s) => [s.seatCode, s]));

    return seatMap.map((row) =>
      row.map((seat) => {
        if (!seat) return null;

        const bookingSeat = bookingSeatByCode.get(seat.seatCode);
        const state = toSeatState(bookingSeat?.status);
        const isMine = bookingSeat?.userId === userId;
        const isAvailable = state === BOOKING_SEAT_STATES.FREE || isMine;

        return {
          ...seat,
          state,
          isMine,
          isAvailable,
        };
      }),
    );
  }

  /**
   * Create HOLDING seats
   * - selectedSeats already expanded (COUPLE => 2 cells)
   */
  public async createHoldingSeats(
    bookingId: string,
    userId: string,
    showtimeId: string,
    roomId: string,
    selectedSeats: AvailableSeat[],
  ) {
    const expiresAt = DateUtil.add(DateUtil.nowUTC(), {
      minutes: BOOKING_TIMINGS.EXPIRE_MINUTES,
    });

    const bookingSeats = selectedSeats.map((seat) => ({
      bookingId: new Types.ObjectId(bookingId),
      userId: new Types.ObjectId(userId),
      showtimeId: new Types.ObjectId(showtimeId),
      roomId: new Types.ObjectId(roomId),
      seatCode: seat.seatCode,
      seatType: seat.seatType,
      status: BOOKING_SEAT_STATUSES.HOLDING,
      expiresAt,
    }));

    const { insertedCount } =
      await this.bookingSeatRepository.command.createMany({
        data: bookingSeats,
      });

    if (insertedCount !== bookingSeats.length) {
      throw new BadRequestException('Booking seats creation failed');
    }
  }

  /**
   * Validate availability
   * - NORMAL / VIP: 1 cell
   * - COUPLE: must have 2 cells & all available
   */
  public assertSeatsAvailable(
    availableSeatMap: AvailableSeatMap,
    selectedSeatCodes: string[],
  ) {
    const seatsByCode = this.buildSeatsByCode(availableSeatMap);

    for (const code of selectedSeatCodes) {
      const seats = seatsByCode.get(code);

      if (!seats || seats.length === 0) {
        throw new BadRequestException(`Seat ${code} does not exist`);
      }

      if (seats[0].seatType === 'COUPLE' && seats.length !== 2) {
        throw new BadRequestException(
          `Seat ${code} must include both couple seats`,
        );
      }

      for (const seat of seats) {
        if (!seat.isAvailable) {
          if (seat.state === BOOKING_SEAT_STATES.HOLD) {
            throw new BadRequestException(`Seat ${code} is currently on hold`);
          }
          if (seat.state === BOOKING_SEAT_STATES.SOLD) {
            throw new BadRequestException(`Seat ${code} is already sold`);
          }
        }
      }
    }
  }

  /**
   * Orphan rule (logical seats)
   * - COUPLE treated as single logical seat
   */
  public assertNoOrphanSeats(
    availableSeatMap: AvailableSeatMap,
    selectedSeatCodes: string[],
  ) {
    if (selectedSeatCodes.length <= 1) return;

    const selectedSet = new Set(selectedSeatCodes);

    for (const row of availableSeatMap) {
      const logicalRow = this.buildLogicalRow(row);

      for (let i = 0; i < logicalRow.length; i++) {
        const seat = logicalRow[i];

        if (!seat.isAvailable) continue;
        if (selectedSet.has(seat.seatCode)) continue;

        const left = i > 0 ? logicalRow[i - 1] : null;
        const right = i < logicalRow.length - 1 ? logicalRow[i + 1] : null;

        const leftBlocked =
          !left || !left.isAvailable || selectedSet.has(left.seatCode);
        const rightBlocked =
          !right || !right.isAvailable || selectedSet.has(right.seatCode);

        if (leftBlocked && rightBlocked) {
          throw new BadRequestException(
            `Seat ${seat.seatCode} would become an orphan seat`,
          );
        }
      }
    }
  }

  /**
   * Validate input seatCodes
   */
  public assertSelectedSeatCodesValid(selectedSeatCodes: string[]) {
    if (!Array.isArray(selectedSeatCodes)) {
      throw new BadRequestException('Seat codes must be an array');
    }

    if (selectedSeatCodes.length === 0) {
      throw new BadRequestException('At least one seat must be selected');
    }

    if (selectedSeatCodes.length > BOOKING_LIMITS.MAX_SEATS_PER_BOOKING) {
      throw new BadRequestException(
        `Maximum ${BOOKING_LIMITS.MAX_SEATS_PER_BOOKING} seats per booking`,
      );
    }

    const seen = new Set<string>();
    for (const code of selectedSeatCodes) {
      if (!this.seatService.isValidSeatCode(code)) {
        throw new BadRequestException(`Invalid seat code format: ${code}`);
      }
      if (seen.has(code)) {
        throw new BadRequestException(`Duplicate seat code: ${code}`);
      }
      seen.add(code);
    }
  }

  /** ================= helpers ================= */

  private buildSeatsByCode(
    availableSeatMap: AvailableSeatMap,
  ): Map<string, AvailableSeat[]> {
    const map = new Map<string, AvailableSeat[]>();

    for (const row of availableSeatMap) {
      for (const seat of row) {
        if (!seat) continue;
        const list = map.get(seat.seatCode);
        list ? list.push(seat) : map.set(seat.seatCode, [seat]);
      }
    }

    return map;
  }

  /**
   * Collapse row by seatCode
   */
  private buildLogicalRow(row: (AvailableSeat | null)[]): AvailableSeat[] {
    const result: AvailableSeat[] = [];
    const seen = new Set<string>();

    for (const seat of row) {
      if (!seat) continue;
      if (seen.has(seat.seatCode)) continue;
      seen.add(seat.seatCode);
      result.push(seat);
    }

    return result;
  }
}
