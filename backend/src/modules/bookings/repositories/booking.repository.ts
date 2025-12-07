/**
 * Booking Repository
 * Data access layer for bookings
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import { BaseRepository, WithId } from '@/modules/shared/repositories/base.repository';

@Injectable()
export class BookingRepository extends BaseRepository<Booking, BookingDocument> {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
  ) {
    super(bookingModel);
  }

  /**
   * Find bookings by user ID with pagination
   */
  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: WithId<Booking>[]; total: number }> {
    return this.findPaginated({
      filter: { userId } as any,
      page,
      limit,
      sort: { createdAt: -1 },
    });
  }

  /**
   * Find bookings by showtime ID
   */
  async findByShowtimeId(showtimeId: string): Promise<WithId<Booking>[]> {
    return this.findMany({
      showtimeId,
      status: { $in: ['confirmed', 'pending'] },
    } as any);
  }

  /**
   * Find booking by booking code
   */
  async findByBookingCode(code: string): Promise<WithId<Booking> | null> {
    return this.findOne({ bookingCode: code } as any);
  }

  /**
   * Find expired bookings that are still pending
   */
  async findExpiredBookings(): Promise<WithId<Booking>[]> {
    const now = new Date();
    
    return this.findMany({
      status: 'pending',
      expiresAt: { $lt: now },
    } as any);
  }

  /**
   * Confirm booking
   */
  async confirmBooking(
    bookingId: string,
    paymentId: string,
  ): Promise<WithId<Booking> | null> {
    const now = new Date();
    
    return this.updateById(bookingId, {
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentId,
      confirmedAt: now,
    } as any);
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string): Promise<WithId<Booking> | null> {
    const now = new Date();
    
    return this.updateById(bookingId, {
      status: 'cancelled',
      cancelledAt: now,
    } as any);
  }

  /**
   * Generate unique booking code
   */
  async generateBookingCode(): Promise<string> {
    const prefix = 'BK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    return `${prefix}${timestamp}${random}`;
  }
}
