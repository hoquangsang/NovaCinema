import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { DAYS_OF_WEEK } from 'src/common/types';
import { ROOM_TYPES, SEAT_TYPES } from 'src/modules/theaters/constants';
import { SeatTypeTicketPricingModifierResDto } from './seat-type-ticket-pricing-modifier.res.dto';
import { RoomTypeTicketPricingModifierResDto } from './room-type-ticket-pricing-modifier.res.dto';
import { DaysOfWeekTicketPricingModifierResDto } from './days-of-week-ticket-pricing-modifirer.res.dto';
import { DailyTimeRangeTicketPricingModifierResDto } from './daily-time-range-ticket-pricing-modifier.res.dto';

export class TicketPricingModifiersResDto {
  @ApiProperty({
    type: [SeatTypeTicketPricingModifierResDto],
    description: 'Seat type pricing modifiers',
    example: [
      { seatType: SEAT_TYPES.NORMAL, deltaPrice: 0 },
      { seatType: SEAT_TYPES.VIP, deltaPrice: 20_000 },
      { seatType: SEAT_TYPES.COUPLE, deltaPrice: 60_000 },
    ],
  })
  @Expose()
  @Type(() => SeatTypeTicketPricingModifierResDto)
  seatTypes!: SeatTypeTicketPricingModifierResDto[];

  @ApiProperty({
    type: [RoomTypeTicketPricingModifierResDto],
    description: 'Room type pricing modifiers',
    example: [
      { roomType: ROOM_TYPES._2D, deltaPrice: 0 },
      { roomType: ROOM_TYPES._3D, deltaPrice: 30_000 },
      { roomType: ROOM_TYPES.VIP, deltaPrice: 50_000 },
    ],
  })
  @Expose()
  @Type(() => RoomTypeTicketPricingModifierResDto)
  roomTypes!: RoomTypeTicketPricingModifierResDto[];

  @ApiProperty({
    type: [DaysOfWeekTicketPricingModifierResDto],
    description: 'Day of week pricing modifiers',
    example: [
      {
        applicableDays: [DAYS_OF_WEEK.SAT, DAYS_OF_WEEK.SUN],
        deltaPrice: 15_000,
      },
    ],
  })
  @Expose()
  @Type(() => DaysOfWeekTicketPricingModifierResDto)
  daysOfWeek!: DaysOfWeekTicketPricingModifierResDto[];

  @ApiProperty({
    type: [DailyTimeRangeTicketPricingModifierResDto],
    description: 'Daily time range pricing modifiers',
    example: [
      { startTime: '10:00', endTime: '16:00', deltaPrice: 0 },
      { startTime: '16:00', endTime: '22:00', deltaPrice: 10_000 },
    ],
  })
  @Expose()
  @Type(() => DailyTimeRangeTicketPricingModifierResDto)
  dailyTimeRanges!: DailyTimeRangeTicketPricingModifierResDto[];
}
