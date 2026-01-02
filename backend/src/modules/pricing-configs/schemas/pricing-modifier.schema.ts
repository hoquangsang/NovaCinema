import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  SeatTypePricingModifierSchema,
  SeatTypePricingModifier,
} from './seat-type-pricing-modifier.schema';
import {
  RoomTypePricingModifierSchema,
  RoomTypePricingModifier,
} from './room-type-pricing-modifier.schema';
import {
  DayOfWeekPricingModifierSchema,
  DayOfWeekPricingModifier,
} from './days-of-week-pricing-modifier.schema';
import {
  DailyTimeRangePricingModifierSchema,
  DailyTimeRangePricingModifier,
} from './daily-time-range-pricing-modifier.schema';

@Schema({ _id: false })
export class PricingModifiers {
  @Prop({ type: [SeatTypePricingModifierSchema], default: [] })
  seatTypes!: SeatTypePricingModifier[];

  @Prop({ type: [RoomTypePricingModifierSchema], default: [] })
  roomTypes!: RoomTypePricingModifier[];

  @Prop({ type: [DayOfWeekPricingModifierSchema], default: [] })
  daysOfWeek!: DayOfWeekPricingModifier[];

  @Prop({ type: [DailyTimeRangePricingModifierSchema], default: [] })
  dailyTimeRanges!: DailyTimeRangePricingModifier[];
}

export const PricingModifiersSchema =
  SchemaFactory.createForClass(PricingModifiers);
