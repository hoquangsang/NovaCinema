/**
 * Domain Model: Showtime
 * Represents a movie screening at a specific time and room
 */

export type ShowtimeStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export class Showtime {
  constructor(
    public readonly id: string,
    public readonly movieId: string,
    public readonly roomId: string,
    public readonly theaterId: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly basePrice: number,
    public readonly status: ShowtimeStatus,
    public readonly availableSeats: number,
    public readonly totalSeats: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Check if showtime is bookable
   */
  isBookable(): boolean {
    const now = new Date();
    return (
      this.status === 'scheduled' &&
      this.startTime > now &&
      this.availableSeats > 0
    );
  }

  /**
   * Check if showtime is ongoing
   */
  isOngoing(): boolean {
    const now = new Date();
    return now >= this.startTime && now <= this.endTime;
  }

  /**
   * Check if showtime is completed
   */
  isCompleted(): boolean {
    const now = new Date();
    return now > this.endTime || this.status === 'completed';
  }

  /**
   * Check if seats are available
   */
  hasAvailableSeats(): boolean {
    return this.availableSeats > 0;
  }

  /**
   * Get occupancy percentage
   */
  getOccupancyRate(): number {
    return ((this.totalSeats - this.availableSeats) / this.totalSeats) * 100;
  }

  /**
   * Check if booking window is still open (e.g., 15 minutes before start)
   */
  isBookingWindowOpen(minutesBeforeStart: number = 15): boolean {
    const now = new Date();
    const bookingDeadline = new Date(this.startTime);
    bookingDeadline.setMinutes(bookingDeadline.getMinutes() - minutesBeforeStart);
    return now < bookingDeadline;
  }
}
