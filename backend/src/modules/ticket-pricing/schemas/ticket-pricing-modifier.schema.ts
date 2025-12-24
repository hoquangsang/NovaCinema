import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  SeatTypePricingModifierSchema,
  SeatTypeTicketPricingModifier,
} from './seat-type-ticket-pricing-modifier.schema';
import {
  RoomTypePricingModifierSchema,
  RoomTypeTicketPricingModifier,
} from './room-type-ticket-pricing-modifier.schema';
import {
  DayOfWeekPricingModifierSchema,
  DayOfWeekTicketPricingModifier,
} from './days-of-week-ticket-pricing-modifier.schema';
import {
  DailyTimeRangePricingModifierSchema,
  DailyTimeRangeTicketPricingModifier,
} from './daily-time-range-ticket-pricing-modifier.schema';

@Schema({ _id: false })
export class TicketPricingModifiers {
  @Prop({ type: [SeatTypePricingModifierSchema], default: [] })
  seatTypes!: SeatTypeTicketPricingModifier[];

  @Prop({ type: [RoomTypePricingModifierSchema], default: [] })
  roomTypes!: RoomTypeTicketPricingModifier[];

  @Prop({ type: [DayOfWeekPricingModifierSchema], default: [] })
  daysOfWeek!: DayOfWeekTicketPricingModifier[];

  @Prop({ type: [DailyTimeRangePricingModifierSchema], default: [] })
  dailyTimeRanges!: DailyTimeRangeTicketPricingModifier[];
}

export const TicketPricingModifiersSchema = SchemaFactory.createForClass(
  TicketPricingModifiers,
);
