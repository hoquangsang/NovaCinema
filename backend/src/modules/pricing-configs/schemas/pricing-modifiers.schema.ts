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
} from './day-of-week-pricing-modifier.schema';

@Schema({ _id: false })
export class PricingModifiers {
  @Prop({
    type: [SeatTypePricingModifierSchema],
    default: [],
  })
  seatTypes!: SeatTypePricingModifier[];

  @Prop({
    type: [RoomTypePricingModifierSchema],
    default: [],
  })
  roomTypes!: RoomTypePricingModifier[];

  @Prop({
    type: [DayOfWeekPricingModifierSchema],
    default: [],
  })
  daysOfWeek!: DayOfWeekPricingModifier[];
}

export const PricingModifiersSchema =
  SchemaFactory.createForClass(PricingModifiers);
