import { DayOfWeek } from 'src/common/types';
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

  export type DayOfWeekModifier = {
    dayOfWeek: DayOfWeek;
    deltaPrice: number;
  };

  export type PricingModifiers = {
    seatTypes?: SeatTypeModifier[];
    roomTypes?: RoomTypeModifier[];
    daysOfWeek?: DayOfWeekModifier[];
  };

  export type Create = {
    basePrice: number;
    modifiers?: PricingModifiers;
  };

  export type Update = {
    basePrice?: number;
    modifiers?: PricingModifiers;
  };

  export type SeatTypePrices = {
    roomType: RoomType;
    effectiveAt: Date;
  };
}

export namespace PricingConfigResult {
  export type SeatTypePrices = Record<SeatType, number>;
}
