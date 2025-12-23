import { DaysOfWeek, TimeHHmm } from 'src/common/types';
import { RoomType, SeatType } from 'src/modules/theaters/types';

export namespace TicketPricingCriteria {
  export type SeatTypeModifiers = {
    seatType: SeatType;
    deltaPrice: number;
  };

  export type RoomTypeModifiers = {
    roomType: RoomType;
    deltaPrice: number;
  };

  export type DaysOfWeekModifiers = {
    applicableDays: DaysOfWeek[];
    deltaPrice: number;
  };

  export type DailyTimeRangeModifiers = {
    startTime: TimeHHmm;
    endTime: TimeHHmm;
    deltaPrice: number;
  };

  export type PricingModifier = {
    seatTypes?: SeatTypeModifiers[];
    roomTypes?: RoomTypeModifiers[];
    daysOfWeek?: DaysOfWeekModifiers[];
    dailyTimeRanges?: DailyTimeRangeModifiers[];
  };

  export type Upsert = {
    basePrice?: number;
    modifiers?: PricingModifier;
  };

  export type Calculate = {
    seatType: SeatType;
    roomType: RoomType;
    datetime: Date;
  };
}

export namespace TicketPricingResult {
  /** */
}
