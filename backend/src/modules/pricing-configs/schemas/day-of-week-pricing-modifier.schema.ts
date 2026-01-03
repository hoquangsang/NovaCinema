import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DAYS_OF_WEEK_VALUES, DayOfWeek } from 'src/common/types';

@Schema({ _id: false })
export class DayOfWeekPricingModifier {
  @Prop({
    type: String,
    enum: DAYS_OF_WEEK_VALUES,
    required: true,
  })
  dayOfWeek!: DayOfWeek;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  deltaPrice!: number;
}

export const DayOfWeekPricingModifierSchema = SchemaFactory.createForClass(
  DayOfWeekPricingModifier,
);
