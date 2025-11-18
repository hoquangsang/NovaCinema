import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type TheaterDocument = HydratedDocument<Theater>;

@Schema()
export class Theater {
  @Prop({ required: true })
  theaterName!: string;
  
  @Prop()
  address?: string;

  @Prop()
  hotline?: string;
}

export const TheaterSchema = SchemaFactory.createForClass(Theater);
