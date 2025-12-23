import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DAYS_OF_WEEK } from 'src/common/types';
import { ROOM_TYPES, SEAT_TYPES } from 'src/modules/theaters/constants';
import { SeatTypeTicketPricingModifierReqDto } from './seat-type-ticket-pricing-modifier.req.dto';
import { RoomTypeTicketPricingModifierReqDto } from './room-type-ticket-pricing-modifier.req.dto';
import { DaysOfWeekTicketPricingModifierReqDto } from './days-of-week-ticket-pricing-modifier.req.dto';
import { DailyTimeRangeTicketPricingModifierReqDto } from './daily-time-range-ticket-pricing-timodifier.req.dto';

export class TicketPricingModifiersReqDto {
  @ApiPropertyOptional({
    type: [SeatTypeTicketPricingModifierReqDto],
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
  @Type(() => SeatTypeTicketPricingModifierReqDto)
  seatTypes?: SeatTypeTicketPricingModifierReqDto[];

  @ApiPropertyOptional({
    type: [RoomTypeTicketPricingModifierReqDto],
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
  @Type(() => RoomTypeTicketPricingModifierReqDto)
  roomTypes?: RoomTypeTicketPricingModifierReqDto[];

  @ApiPropertyOptional({
    type: [DaysOfWeekTicketPricingModifierReqDto],
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
  @Type(() => DaysOfWeekTicketPricingModifierReqDto)
  daysOfWeek?: DaysOfWeekTicketPricingModifierReqDto[];

  @ApiPropertyOptional({
    type: [DailyTimeRangeTicketPricingModifierReqDto],
    description: 'Daily time range pricing modifiers',
    example: [
      { startTime: '16:00', endTime: '22:00', deltaPrice: 10_000 },
      { startTime: '22:00', endTime: '06:00', deltaPrice: 20_000 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyTimeRangeTicketPricingModifierReqDto)
  dailyTimeRanges?: DailyTimeRangeTicketPricingModifierReqDto[];
}
