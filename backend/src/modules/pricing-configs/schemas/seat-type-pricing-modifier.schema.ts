import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SEAT_TYPE_VALUES } from 'src/modules/theaters/constants';
import { SeatType } from 'src/modules/theaters/types';

@Schema({ _id: false })
export class SeatTypePricingModifier {
  @Prop({ type: String, enum: SEAT_TYPE_VALUES, required: true })
  seatType!: SeatType;

  @Prop({ type: Number, min: 0, required: true })
  deltaPrice!: number;
}
export const SeatTypePricingModifierSchema = SchemaFactory.createForClass(
  SeatTypePricingModifier,
);
