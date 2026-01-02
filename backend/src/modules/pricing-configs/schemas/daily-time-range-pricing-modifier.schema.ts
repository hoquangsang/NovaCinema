import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TimeHHmm } from 'src/common/types';

@Schema({ _id: false })
export class DailyTimeRangePricingModifier {
  @Prop({ required: true })
  startTime!: TimeHHmm;

  @Prop({ required: true })
  endTime!: TimeHHmm;

  @Prop({ type: Number, min: 0, required: true })
  deltaPrice!: number;
}
export const DailyTimeRangePricingModifierSchema = SchemaFactory.createForClass(
  DailyTimeRangePricingModifier,
);
