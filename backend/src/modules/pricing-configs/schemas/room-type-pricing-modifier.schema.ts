import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ROOM_TYPE_VALUES } from 'src/modules/theaters/constants';
import { RoomType } from 'src/modules/theaters/types';

@Schema({ _id: false })
export class RoomTypePricingModifier {
  @Prop({
    type: String,
    enum: ROOM_TYPE_VALUES,
    required: true,
  })
  roomType!: RoomType;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  deltaPrice!: number;
}

export const RoomTypePricingModifierSchema = SchemaFactory.createForClass(
  RoomTypePricingModifier,
);
