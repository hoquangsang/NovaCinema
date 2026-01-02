import { DaysOfWeek, TimeHHmm } from 'src/common/types';
import { RoomType, SeatType } from 'src/modules/theaters/types';

export namespace PricingConfigCriteria {
  export type SeatTypeModifier = {
    seatType: SeatType;
    deltaPrice: number;
  };

  export type RoomTypeModifier = {
    roomType: RoomType;
    deltaPrice: number;
  };

  export type DaysOfWeekModifier = {
    applicableDays: DaysOfWeek[];
    deltaPrice: number;
  };

  export type DailyTimeRangeModifier = {
    startTime: TimeHHmm;
    endTime: TimeHHmm;
    deltaPrice: number;
  };

  export type PricingModifier = {
    seatTypes?: SeatTypeModifier[];
    roomTypes?: RoomTypeModifier[];
    daysOfWeek?: DaysOfWeekModifier[];
    dailyTimeRanges?: DailyTimeRangeModifier[];
  };

  export type Upsert = {
    basePrice?: number;
    modifiers?: PricingModifier;
  };

  export type SeatTypePrices = {
    roomType: RoomType;
    effectiveAt: Date;
  };
}

export namespace PricingConfigResult {
  export type SeatTypePrices = {
    readonly [K in SeatType]: number;
  };
}
