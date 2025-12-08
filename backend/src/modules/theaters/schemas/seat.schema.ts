import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Room } from "./room.schema";
import { Theater } from "./theater.schema";

export type SeatDocument = HydratedDocument<Seat>;

@Schema()
export class Seat {
  @Prop({ type: Types.ObjectId, ref: Theater.name, required: true })
  theaterId!: Types.ObjectId;
  
  @Prop({ type: Types.ObjectId, ref: Room.name, required: true })
  roomId!: Types.ObjectId;

  @Prop({ required: true })
  row!: number;

  @Prop({ required: true })
  number!: number;

  @Prop({ required: true })
  seatCode!: string;

  @Prop({ required: true, enum: ['standard', 'vip', 'couple'] })
  type!: string;

  @Prop({
    required: true,
    enum: ['available', 'reserved', 'booked', 'maintenance'],
    default: 'available',
  })
  status!: string;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);