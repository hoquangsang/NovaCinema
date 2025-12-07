import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Theater } from "./theater.schema";

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop({ type: Types.ObjectId, ref: Theater.name, required: true })
  theaterId!: Types.ObjectId;
  
  @Prop({ required: true })
  roomName!: string;

  @Prop({ required: true })
  rowCount!: number;

  @Prop({ required: true })
  seatsPerRow!: number;

  @Prop({ required: true })
  capacity!: number;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
