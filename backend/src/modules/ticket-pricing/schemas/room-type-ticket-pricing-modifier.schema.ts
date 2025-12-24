import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ROOM_TYPE_VALUES } from 'src/modules/theaters/constants';
import { RoomType } from 'src/modules/theaters/types';

@Schema({ _id: false })
export class RoomTypeTicketPricingModifier {
  @Prop({ type: String, enum: ROOM_TYPE_VALUES, required: true })
  roomType!: RoomType;

  @Prop({ type: Number, min: 0, required: true })
  deltaPrice!: number;
}
export const RoomTypePricingModifierSchema = SchemaFactory.createForClass(
  RoomTypeTicketPricingModifier,
);
