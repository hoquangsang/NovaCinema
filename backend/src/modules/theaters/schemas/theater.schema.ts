import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TheaterDocument = HydratedDocument<Theater>;

@Schema({ timestamps: true })
export class Theater {
  @Prop({ required: true })
  theaterName!: string;

  @Prop()
  address?: string;

  @Prop()
  hotline?: string;

  @Prop({ default: true })
  isActive?: boolean;
}

export const TheaterSchema = SchemaFactory.createForClass(Theater);
TheaterSchema.index({ theaterName: 1, address: 1 }, { unique: true });
