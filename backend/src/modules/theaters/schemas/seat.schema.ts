import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SEAT_TYPES, SeatType } from "../constants";

export type SeatMap = (Seat | null)[][];

@Schema({ _id: false })
export class Seat {
  @Prop({ required: true })
  seatCode!: string;

  @Prop({ type: String, enum: SEAT_TYPES, default: 'NORMAL' })
  seatType?: SeatType;

  @Prop({ default: true })
  isActive?: boolean;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);
