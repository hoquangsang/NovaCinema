import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SEAT_TYPES } from 'src/modules/theaters/constants';
import { SeatType } from 'src/modules/theaters/types';

export class SeatTypePricingModifierResDto {
  @ApiProperty({
    type: String,
    description: 'Seat type for pricing modifier',
    example: SEAT_TYPES.VIP,
  })
  @Expose()
  seatType!: SeatType;

  @ApiProperty({
    type: Number,
    description: 'Price delta for this seat type',
    example: 20_000,
  })
  @Expose()
  deltaPrice!: number;
}
