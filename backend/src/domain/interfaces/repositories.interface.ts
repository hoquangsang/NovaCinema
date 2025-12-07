/**
 * Domain Repository Interfaces
 * These define the contract for data access without implementation details
 * Following Repository Pattern and Dependency Inversion Principle
 */

import { Movie, Theater, Room, Seat, User, Showtime, Booking } from '../models';

export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: Record<string, 1 | -1>;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Generic Repository Interface
 */
export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  updateById(id: string, data: Partial<T>): Promise<T | null>;
  deleteById(id: string): Promise<boolean>;
}

/**
 * Movie Repository Interface
 */
export interface IMovieRepository extends IRepository<Movie> {
  findShowingMovies(options: PaginationOptions): Promise<PaginatedResult<Movie>>;
  findUpcomingMovies(options: PaginationOptions): Promise<PaginatedResult<Movie>>;
  findByGenre(genre: string, options: PaginationOptions): Promise<PaginatedResult<Movie>>;
  search(query: string, options: PaginationOptions): Promise<PaginatedResult<Movie>>;
}

/**
 * Theater Repository Interface
 */
export interface ITheaterRepository extends IRepository<Theater> {
  findByCity(city: string): Promise<Theater[]>;
  findActiveTheaters(): Promise<Theater[]>;
}

/**
 * Room Repository Interface
 */
export interface IRoomRepository extends IRepository<Room> {
  findByTheaterId(theaterId: string): Promise<Room[]>;
  findAvailableRooms(theaterId: string): Promise<Room[]>;
}

/**
 * Seat Repository Interface
 */
export interface ISeatRepository extends IRepository<Seat> {
  findByRoomId(roomId: string): Promise<Seat[]>;
  findAvailableSeats(roomId: string): Promise<Seat[]>;
  bulkUpdateStatus(seatIds: string[], status: string): Promise<boolean>;
}

/**
 * User Repository Interface
 */
export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
  findActiveUsers(options: PaginationOptions): Promise<PaginatedResult<User>>;
}

/**
 * Showtime Repository Interface
 */
export interface IShowtimeRepository extends IRepository<Showtime> {
  findByMovieId(movieId: string, options: PaginationOptions): Promise<PaginatedResult<Showtime>>;
  findByTheaterId(theaterId: string, date: Date): Promise<Showtime[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Showtime[]>;
  findBookableShowtimes(movieId: string, theaterId: string): Promise<Showtime[]>;
  updateAvailableSeats(showtimeId: string, decrement: number): Promise<boolean>;
}

/**
 * Booking Repository Interface
 */
export interface IBookingRepository extends IRepository<Booking> {
  findByUserId(userId: string, options: PaginationOptions): Promise<PaginatedResult<Booking>>;
  findByShowtimeId(showtimeId: string): Promise<Booking[]>;
  findByBookingCode(code: string): Promise<Booking | null>;
  findExpiredBookings(): Promise<Booking[]>;
  confirmBooking(bookingId: string, paymentId: string): Promise<Booking | null>;
  cancelBooking(bookingId: string): Promise<Booking | null>;
}
