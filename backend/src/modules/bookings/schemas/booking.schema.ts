/**
 * MongoDB Schema: Booking
 * Database schema for ticket bookings
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ _id: false })
export class BookedSeat {
  @Prop({ type: Types.ObjectId, ref: 'Seat', required: true })
  seatId: Types.ObjectId;

  @Prop({ type: String, required: true })
  row: string;

  @Prop({ type: Number, required: true })
  number: number;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;
}

const BookedSeatSchema = SchemaFactory.createForClass(BookedSeat);

@Schema({ timestamps: true, collection: 'bookings' })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Showtime', required: true })
  showtimeId: Types.ObjectId;

  @Prop({ type: [BookedSeatSchema], required: true })
  seats: BookedSeat[];

  @Prop({ type: Number, required: true, min: 0 })
  totalAmount: number;

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'expired'],
    default: 'pending',
  })
  status: string;

  @Prop({
    type: String,
    enum: ['credit_card', 'debit_card', 'e_wallet', 'cash'],
    required: false,
  })
  paymentMethod: string;

  @Prop({
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  })
  paymentStatus: string;

  @Prop({ type: String, required: false })
  paymentId: string;

  @Prop({ type: String, required: true, unique: true })
  bookingCode: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Date, required: false })
  confirmedAt: Date;

  @Prop({ type: Date, required: false })
  cancelledAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Indexes
BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ showtimeId: 1 });
BookingSchema.index({ bookingCode: 1 }, { unique: true });
BookingSchema.index({ status: 1, expiresAt: 1 });
BookingSchema.index({ paymentStatus: 1 });
