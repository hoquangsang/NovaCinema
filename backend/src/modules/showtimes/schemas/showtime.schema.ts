/**
 * MongoDB Schema: Showtime
 * Database schema for movie showtimes
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ShowtimeDocument = Showtime & Document;

@Schema({ timestamps: true, collection: 'showtimes' })
export class Showtime {
  @Prop({ type: Types.ObjectId, ref: 'Movie', required: true })
  movieId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Theater', required: true })
  theaterId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  startTime: Date;

  @Prop({ type: Date, required: true })
  endTime: Date;

  @Prop({ type: Number, required: true, min: 0 })
  basePrice: number;

  @Prop({
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled',
  })
  status: string;

  @Prop({ type: Number, required: true, min: 0 })
  availableSeats: number;

  @Prop({ type: Number, required: true, min: 0 })
  totalSeats: number;
}

export const ShowtimeSchema = SchemaFactory.createForClass(Showtime);

// Indexes for better query performance
ShowtimeSchema.index({ movieId: 1, startTime: 1 });
ShowtimeSchema.index({ theaterId: 1, startTime: 1 });
ShowtimeSchema.index({ roomId: 1, startTime: 1 });
ShowtimeSchema.index({ status: 1, startTime: 1 });
