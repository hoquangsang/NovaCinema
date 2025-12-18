import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SEAT_TYPE_VALUES, SEAT_TYPES } from '../constants';
import { SeatType } from '../types';

export type SeatMap = (Seat | null)[][];

@Schema({ _id: false })
export class Seat {
  @Prop({ required: true })
  seatCode!: string;

  @Prop({ type: String, enum: SEAT_TYPE_VALUES, default: SEAT_TYPES.NORMAL })
  seatType?: SeatType;

  @Prop({ default: true })
  isActive?: boolean;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);
