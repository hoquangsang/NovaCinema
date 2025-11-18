import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Room } from "./room.schema";

export type SeatDocument = HydratedDocument<Seat>;

@Schema()
export class Seat {
  @Prop({
    type: Types.ObjectId,
    ref: Room.name,
    required: true
  })
  roomId!: Types.ObjectId;

  @Prop({ required: true })
  seatNumber!: string;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);
// SeatSchema.index({ seatNumber: 1});