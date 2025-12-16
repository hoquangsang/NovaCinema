import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ROOM_TYPES, RoomType } from "../constants";
import { Theater } from "./theater.schema";
import { SeatMap, SeatSchema } from "./seat.schema";

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: Types.ObjectId, ref: Theater.name, required: true })
  theaterId!: Types.ObjectId;
  
  @Prop({ required: true })
  roomName!: string;

  @Prop({ type: String, enum: ROOM_TYPES, default: '2D' })
  roomType?: RoomType;
  
  @Prop({ type: [[{ type: SeatSchema }]], required: true })
  seatMap!: SeatMap;
  
  @Prop({ default: true })
  isActive?: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.index({ theaterId: 1, roomName: 1 }, { unique: true });
