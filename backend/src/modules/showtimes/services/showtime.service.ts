/**
 * Showtime Service
 * Business logic for showtime operations
 */

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ShowtimeRepository } from '../repositories/showtime.repository';
import { RoomRepository } from '@/modules/theaters/repositories/room.repository';

@Injectable()
export class ShowtimeService {
  constructor(
    private readonly showtimeRepo: ShowtimeRepository,
    private readonly roomRepo: RoomRepository,
  ) {}

  /**
   * Get showtime by ID
   */
  async getShowtimeById(showtimeId: string) {
    return this.showtimeRepo.findById(showtimeId);
  }

  /**
   * Get showtimes by movie ID
   */
  async getShowtimesByMovie(movieId: string, page: number = 1, limit: number = 10) {
    return this.showtimeRepo.findByMovieId(movieId, page, limit);
  }

  /**
   * Get showtimes by theater and date
   */
  async getShowtimesByTheaterAndDate(theaterId: string, date: Date) {
    return this.showtimeRepo.findByTheaterIdAndDate(theaterId, date);
  }

  /**
   * Get bookable showtimes
   */
  async getBookableShowtimes(movieId: string, theaterId: string) {
    return this.showtimeRepo.findBookableShowtimes(movieId, theaterId);
  }

  /**
   * Create a new showtime
   */
  async createShowtime(params: {
    movieId: string;
    roomId: string;
    theaterId: string;
    startTime: Date;
    duration: number; // in minutes
    basePrice: number;
  }) {
    const { movieId, roomId, theaterId, startTime, duration, basePrice } = params;

    // Validate room exists
    const room = await this.roomRepo.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Calculate end time
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    // Create showtime
    return this.showtimeRepo.create({
      movieId,
      roomId,
      theaterId,
      startTime,
      endTime,
      basePrice,
      status: 'scheduled',
      availableSeats: room.capacity,
      totalSeats: room.capacity,
    } as any);
  }

  /**
   * Update showtime status
   */
  async updateShowtimeStatus(showtimeId: string, status: string) {
    const showtime = await this.showtimeRepo.findById(showtimeId);
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }

    return this.showtimeRepo.updateById(showtimeId, { status } as any);
  }

  /**
   * Delete showtime
   */
  async deleteShowtime(showtimeId: string) {
    const showtime = await this.showtimeRepo.findById(showtimeId);
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }

    // Only allow deletion if no bookings exist
    // This should be checked in production
    return this.showtimeRepo.deleteById(showtimeId);
  }
}
