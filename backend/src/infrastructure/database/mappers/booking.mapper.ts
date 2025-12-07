/**
 * Data Mapper: Booking
 */

import { Booking, BookingStatus, PaymentMethod, PaymentStatus, BookedSeat } from '@/domain/models';

export interface BookingDocument {
  _id: string;
  userId: string;
  showtimeId: string;
  seats: BookedSeat[];
  totalAmount: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod | null;
  paymentStatus: PaymentStatus;
  paymentId: string | null;
  bookingCode: string;
  expiresAt: Date;
  confirmedAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class BookingMapper {
  static toDomain(doc: BookingDocument): Booking {
    return new Booking(
      doc._id.toString(),
      doc.userId.toString(),
      doc.showtimeId.toString(),
      doc.seats,
      doc.totalAmount,
      doc.status,
      doc.paymentMethod,
      doc.paymentStatus,
      doc.paymentId,
      doc.bookingCode,
      new Date(doc.expiresAt),
      doc.confirmedAt ? new Date(doc.confirmedAt) : null,
      doc.cancelledAt ? new Date(doc.cancelledAt) : null,
      new Date(doc.createdAt),
      new Date(doc.updatedAt),
    );
  }

  static toPersistence(booking: Booking): Omit<BookingDocument, '_id' | 'createdAt' | 'updatedAt'> {
    return {
      userId: booking.userId,
      showtimeId: booking.showtimeId,
      seats: booking.seats,
      totalAmount: booking.totalAmount,
      status: booking.status,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      paymentId: booking.paymentId,
      bookingCode: booking.bookingCode,
      expiresAt: booking.expiresAt,
      confirmedAt: booking.confirmedAt,
      cancelledAt: booking.cancelledAt,
    };
  }

  static toDomainArray(docs: BookingDocument[]): Booking[] {
    return docs.map(doc => this.toDomain(doc));
  }
}
