/**
 * Showtime Repository
 * Data access layer for showtimes
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Showtime, ShowtimeDocument } from '../schemas/showtime.schema';
import { BaseRepository, WithId } from '@/modules/shared/repositories/base.repository';

@Injectable()
export class ShowtimeRepository extends BaseRepository<Showtime, ShowtimeDocument> {
  constructor(
    @InjectModel(Showtime.name) private readonly showtimeModel: Model<ShowtimeDocument>,
  ) {
    super(showtimeModel);
  }

  /**
   * Find showtimes by movie ID with pagination
   */
  async findByMovieId(
    movieId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: WithId<Showtime>[]; total: number }> {
    return this.findPaginated({
      filter: { movieId } as any,
      page,
      limit,
      sort: { startTime: 1 },
    });
  }

  /**
   * Find showtimes by theater ID and date
   */
  async findByTheaterIdAndDate(
    theaterId: string,
    date: Date,
  ): Promise<WithId<Showtime>[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.findMany({
      theaterId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
    } as any);
  }

  /**
   * Find bookable showtimes for a movie at a theater
   */
  async findBookableShowtimes(
    movieId: string,
    theaterId: string,
  ): Promise<WithId<Showtime>[]> {
    const now = new Date();
    
    return this.findMany({
      movieId,
      theaterId,
      status: 'scheduled',
      startTime: { $gt: now },
      availableSeats: { $gt: 0 },
    } as any);
  }

  /**
   * Update available seats count
   */
  async updateAvailableSeats(
    showtimeId: string,
    decrement: number,
  ): Promise<boolean> {
    const result = await this.showtimeModel.updateOne(
      { _id: showtimeId, availableSeats: { $gte: decrement } },
      { $inc: { availableSeats: -decrement } },
    );

    return result.modifiedCount > 0;
  }

  /**
   * Find showtimes by date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<WithId<Showtime>[]> {
    return this.findMany({
      startTime: { $gte: startDate, $lte: endDate },
    } as any);
  }
}
