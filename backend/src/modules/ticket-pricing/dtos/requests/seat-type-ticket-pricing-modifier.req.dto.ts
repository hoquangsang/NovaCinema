import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { SEAT_TYPE_VALUES, SEAT_TYPES } from 'src/modules/theaters/constants';
import { SeatType } from 'src/modules/theaters/types';

export class SeatTypeTicketPricingModifierReqDto {
  @ApiProperty({
    type: String,
    description: 'Seat type for pricing modifier',
    enum: SEAT_TYPE_VALUES,
    example: SEAT_TYPES.VIP,
  })
  @IsEnum(SEAT_TYPE_VALUES)
  seatType!: SeatType;

  @ApiProperty({
    type: Number,
    description: 'Price delta for this seat type',
    example: 20_000,
    minimum: 0,
  })
  @Min(0)
  @IsNumber()
  deltaPrice!: number;
}
