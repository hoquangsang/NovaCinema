import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DAYS_OF_WEEK } from 'src/common/types';
import { ROOM_TYPES, SEAT_TYPES } from 'src/modules/theaters/constants';
import { SeatTypePricingModifierReqDto } from './seat-type-pricing-modifier.req.dto';
import { RoomTypePricingModifierReqDto } from './room-type-pricing-modifier.req.dto';
import { DaysOfWeekPricingModifierReqDto } from './days-of-week-pricing-modifier.req.dto';
import { DailyTimeRangePricingModifierReqDto } from './daily-time-range-pricing-modifier.req.dto';

export class PricingModifiersReqDto {
  @ApiPropertyOptional({
    type: [SeatTypePricingModifierReqDto],
    description: 'Seat type pricing modifiers',
    example: [
      { seatType: SEAT_TYPES.NORMAL, deltaPrice: 0 },
      { seatType: SEAT_TYPES.VIP, deltaPrice: 20_000 },
      { seatType: SEAT_TYPES.COUPLE, deltaPrice: 60_000 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatTypePricingModifierReqDto)
  seatTypes?: SeatTypePricingModifierReqDto[];

  @ApiPropertyOptional({
    type: [RoomTypePricingModifierReqDto],
    description: 'Room type pricing modifiers',
    example: [
      { roomType: ROOM_TYPES._2D, deltaPrice: 0 },
      { roomType: ROOM_TYPES._3D, deltaPrice: 30_000 },
      { roomType: ROOM_TYPES.VIP, deltaPrice: 50_000 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomTypePricingModifierReqDto)
  roomTypes?: RoomTypePricingModifierReqDto[];

  @ApiPropertyOptional({
    type: [DaysOfWeekPricingModifierReqDto],
    description: 'Day of week pricing modifiers',
    example: [
      {
        applicableDays: [DAYS_OF_WEEK.SAT, DAYS_OF_WEEK.SUN],
        deltaPrice: 15_000,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DaysOfWeekPricingModifierReqDto)
  daysOfWeek?: DaysOfWeekPricingModifierReqDto[];

  @ApiPropertyOptional({
    type: [DailyTimeRangePricingModifierReqDto],
    description: 'Daily time range pricing modifiers',
    example: [
      { startTime: '16:00', endTime: '22:00', deltaPrice: 10_000 },
      { startTime: '22:00', endTime: '06:00', deltaPrice: 20_000 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyTimeRangePricingModifierReqDto)
  dailyTimeRanges?: DailyTimeRangePricingModifierReqDto[];
}
