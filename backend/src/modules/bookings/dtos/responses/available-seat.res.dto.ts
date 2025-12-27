import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SEAT_TYPE_VALUES, SEAT_TYPES } from 'src/modules/theaters/constants';
import { SeatType } from 'src/modules/theaters/types';
import {
  BOOKING_SEAT_STATE_VALUES,
  BOOKING_SEAT_STATES,
} from '../../constants';
import { BookingSeatState } from '../../types';

export class AvailableSeatResDto {
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
    enum: BOOKING_SEAT_STATE_VALUES,
    example: BOOKING_SEAT_STATES.FREE,
  })
  @Expose()
  state!: BookingSeatState;

  @ApiProperty({
    type: Boolean,
    description: 'Is this seat booked by current user',
    example: false,
  })
  @Expose()
  isMine?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Is seat available for booking',
    example: true,
  })
  @Expose()
  isAvailable!: boolean;
}
