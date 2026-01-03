import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { DAYS_OF_WEEK } from 'src/common/types';
import { ROOM_TYPES, SEAT_TYPES } from 'src/modules/theaters/constants';
import { SeatTypePricingModifierResDto } from './seat-type-pricing-modifier.res.dto';
import { RoomTypePricingModifierResDto } from './room-type-pricing-modifier.res.dto';
import { DayOfWeekPricingModifierResDto } from './day-of-week-pricing-modifier.res.dto';

export class PricingModifiersResDto {
  @ApiProperty({
    type: [SeatTypePricingModifierResDto],
    description: 'Seat type pricing modifiers',
    example: [
      { seatType: SEAT_TYPES.NORMAL, deltaPrice: 0 },
      { seatType: SEAT_TYPES.VIP, deltaPrice: 20_000 },
      { seatType: SEAT_TYPES.COUPLE, deltaPrice: 60_000 },
    ],
  })
  @Expose()
  @Type(() => SeatTypePricingModifierResDto)
  seatTypes!: SeatTypePricingModifierResDto[];

  @ApiProperty({
    type: [RoomTypePricingModifierResDto],
    description: 'Room type pricing modifiers',
    example: [
      { roomType: ROOM_TYPES._2D, deltaPrice: 0 },
      { roomType: ROOM_TYPES._3D, deltaPrice: 30_000 },
      { roomType: ROOM_TYPES.VIP, deltaPrice: 50_000 },
    ],
  })
  @Expose()
  @Type(() => RoomTypePricingModifierResDto)
  roomTypes!: RoomTypePricingModifierResDto[];

  @ApiProperty({
    type: [DayOfWeekPricingModifierResDto],
    description: 'Day of week pricing modifiers',
    example: [
      {
        dayOfWeek: DAYS_OF_WEEK.SUN,
        deltaPrice: 15_000,
      },
    ],
  })
  @Expose()
  @Type(() => DayOfWeekPricingModifierResDto)
  daysOfWeek!: DayOfWeekPricingModifierResDto[];
}
