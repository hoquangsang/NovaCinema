import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SEAT_TYPES } from 'src/modules/theaters/constants';
import { SeatType } from 'src/modules/theaters/types';

export class SeatResDto {
  @ApiProperty({ type: String, description: 'Seat code', example: 'A2' })
  @Expose()
  seatCode!: string;

  @ApiProperty({
    type: String,
    enum: SEAT_TYPES,
    description: 'Seat type',
    example: 'NORMAL',
  })
  @Expose()
  seatType!: SeatType;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Seat is active',
    example: true,
  })
  @Expose()
  isActive?: boolean;
}
