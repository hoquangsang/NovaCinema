/**
 * Data Mapper: Showtime
 */

import { Showtime, ShowtimeStatus } from '@/domain/models';

export interface ShowtimeDocument {
  _id: string;
  movieId: string;
  roomId: string;
  theaterId: string;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  status: ShowtimeStatus;
  availableSeats: number;
  totalSeats: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ShowtimeMapper {
  static toDomain(doc: ShowtimeDocument): Showtime {
    return new Showtime(
      doc._id.toString(),
      doc.movieId.toString(),
      doc.roomId.toString(),
      doc.theaterId.toString(),
      new Date(doc.startTime),
      new Date(doc.endTime),
      doc.basePrice,
      doc.status,
      doc.availableSeats,
      doc.totalSeats,
      new Date(doc.createdAt),
      new Date(doc.updatedAt),
    );
  }

  static toPersistence(showtime: Showtime): Omit<ShowtimeDocument, '_id' | 'createdAt' | 'updatedAt'> {
    return {
      movieId: showtime.movieId,
      roomId: showtime.roomId,
      theaterId: showtime.theaterId,
      startTime: showtime.startTime,
      endTime: showtime.endTime,
      basePrice: showtime.basePrice,
      status: showtime.status,
      availableSeats: showtime.availableSeats,
      totalSeats: showtime.totalSeats,
    };
  }

  static toDomainArray(docs: ShowtimeDocument[]): Showtime[] {
    return docs.map(doc => this.toDomain(doc));
  }
}
