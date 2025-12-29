import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
<<<<<<< HEAD
import { Booking } from './booking.schema';
=======
>>>>>>> fix/be/showtimes
import { User } from 'src/modules/users';
import { Room } from 'src/modules/theaters';
import { Showtime } from 'src/modules/showtimes';
import {
  BOOKING_SEAT_STATUS_VALUES,
  BOOKING_SEAT_STATUSES,
} from '../constants';
import { BookingSeatStatus } from '../types';
import { Booking } from './booking.schema';

export type BookingSeatDocument = HydratedDocument<BookingSeat>;

@Schema({ timestamps: true })
export class BookingSeat {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Booking.name,
    required: true,
    immutable: true,
  })
  bookingId!: Types.ObjectId;

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
    type: MongooseSchema.Types.ObjectId,
    ref: Room.name,
    required: true,
    immutable: true,
  })
  roomId!: Types.ObjectId;

  @Prop({
    required: true,
    immutable: true,
  })
  seatCode!: string;

  @Prop({
    required: true,
    enum: BOOKING_SEAT_STATUS_VALUES,
    default: BOOKING_SEAT_STATUSES.HOLDING,
  })
  status!: BookingSeatStatus;

  // only use when HOLDING
  @Prop()
  expiresAt?: Date;
}

export const BookingSeatSchema = SchemaFactory.createForClass(BookingSeat);

// 1) Ngăn oversell — mỗi ghế trong 1 showtime chỉ có thể nằm trong 1 document
BookingSeatSchema.index(
  { showtimeId: 1, roomId: 1, seatCode: 1 },
  { unique: true },
);

// 2) Truy vấn seat availability nhanh:
BookingSeatSchema.index({ showtimeId: 1, status: 1 });

// 3) TTL index — tự động xoá ghế HOLDING hết hạn
BookingSeatSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
