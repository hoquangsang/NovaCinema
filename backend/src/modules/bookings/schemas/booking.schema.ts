import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from 'src/modules/users';
import { Showtime } from 'src/modules/showtimes';
import { BOOKING_STATUS_VALUES } from '../constants';
import { BookingStatus } from '../types';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
    immutable: true,
  })
  userId!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Showtime.name,
    required: true,
    immutable: true,
  })
  showtimeId!: Types.ObjectId;

  @Prop({
    required: true,
    enum: BOOKING_STATUS_VALUES,
  })
  status!: BookingStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ userId: 1, startAt: -1 });
BookingSchema.index({ startAt: 1 });
