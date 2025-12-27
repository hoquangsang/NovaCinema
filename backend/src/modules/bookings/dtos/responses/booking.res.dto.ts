import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BookingStatus } from '../../types';
import { BOOKING_STATUS_VALUES, BOOKING_STATUSES } from '../../constants';

export class BookingResDto {
  @ApiProperty({
    type: String,
    description: 'Booking ID',
    example: '665c1e1f8e4b3a0012abc999',
  })
  @Expose()
  _id!: string;

  @ApiProperty({
    type: String,
    description: 'User ID',
  })
  @Expose()
  userId!: string;

  @ApiProperty({
    type: String,
    description: 'Showtime ID',
  })
  @Expose()
  showtimeId!: string;

  @ApiProperty({
    type: String,
    enum: BOOKING_STATUS_VALUES,
    description: 'Booking status',
    example: BOOKING_STATUSES.PENDING,
  })
  @Expose()
  status!: BookingStatus;

  @ApiProperty({
    type: [String],
    description: 'Selected seat codes (logical seats)',
    example: ['A10', 'A12'],
  })
  @Expose()
  seatCodes!: string[];
}
