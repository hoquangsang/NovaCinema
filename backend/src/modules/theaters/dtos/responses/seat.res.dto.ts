import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SEAT_TYPE_VALUES, SEAT_TYPES } from 'src/modules/theaters/constants';
import { SeatType } from 'src/modules/theaters/types';

export class SeatResDto {
  @ApiProperty({ type: String, description: 'Seat code', example: 'A2' })
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

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Seat is active',
    example: true,
  })
  @Expose()
  isActive?: boolean;
}
