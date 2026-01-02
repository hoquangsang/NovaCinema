import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DAYS_OF_WEEK_VALUES, DaysOfWeek } from 'src/common/types';

@Schema({ _id: false })
export class DayOfWeekPricingModifier {
  @Prop({ type: [String], enum: DAYS_OF_WEEK_VALUES, required: true })
  applicableDays!: DaysOfWeek[];

  @Prop({ type: Number, min: 0, required: true })
  deltaPrice!: number;
}
export const DayOfWeekPricingModifierSchema = SchemaFactory.createForClass(
  DayOfWeekPricingModifier,
);
