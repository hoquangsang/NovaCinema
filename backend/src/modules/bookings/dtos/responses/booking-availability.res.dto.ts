import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SEAT_TYPE_VALUES, SEAT_TYPES } from 'src/modules/theaters/constants';
import { SeatType } from 'src/modules/theaters/types';
import { BookingSeatStatus } from '../../types';
import {
  BOOKING_SEAT_STATUS_VALUES,
  BOOKING_SEAT_STATUSES,
} from '../../constants';

class SeatTypePriceResDto {
  @ApiProperty({
    type: String,
    description: 'Seat type',
    example: SEAT_TYPES.NORMAL,
  })
  @Expose()
  seatType!: SeatType;

  @ApiProperty({
    type: Number,
    description: 'Price for this seat type',
    example: 50_000,
  })
  @Expose()
  price!: number;
}

class SeatAvailabilityResDto {
  @ApiProperty({
    type: String,
    description: 'Seat code',
    example: 'A1',
  })
  @Expose()
  seatCode!: string;

  @ApiProperty({
    type: String,
    enum: SEAT_TYPE_VALUES,
    description: 'Seat type',
    example: SEAT_TYPES.NORMAL,
  })
  @Expose()
  seatType!: SeatType;

  @ApiProperty({
    type: String,
    description: 'Booking seat state',
    enum: BOOKING_SEAT_STATUS_VALUES,
    example: BOOKING_SEAT_STATUSES.AVAILABLE,
  })
  @Expose()
  status!: BookingSeatStatus;

  @ApiProperty({
    type: Boolean,
    description: 'Is seat available for booking',
    example: true,
  })
  @Expose()
  isAvailable!: boolean;
}

type SeatAvailabilityMap = (SeatAvailabilityResDto | null)[][];

export class BookingAvailabilityResDto {
  @ApiProperty({
    description:
      'Seat availability map representing the current booking state of the room',
  })
  @Expose()
  @Type(() => SeatAvailabilityResDto)
  seatMap!: SeatAvailabilityMap;

  @ApiProperty({
    type: [SeatTypePriceResDto],
    description: 'Seat type pricing applied to this showtime for booking',
  })
  @Expose()
  @Type(() => SeatTypePriceResDto)
  prices!: SeatTypePriceResDto[];
}
