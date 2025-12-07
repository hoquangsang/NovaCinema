/**
 * Domain Model: Seat
 * Represents a seat in a room
 */

export type SeatType = 'standard' | 'vip' | 'couple';
export type SeatStatus = 'available' | 'reserved' | 'booked' | 'maintenance';

export class Seat {
  constructor(
    public readonly id: string,
    public readonly roomId: string,
    public readonly row: string,
    public readonly number: number,
    public readonly type: SeatType,
    public readonly status: SeatStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Get seat label (e.g., "A12")
   */
  getLabel(): string {
    return `${this.row}${this.number}`;
  }

  /**
   * Check if seat is available for booking
   */
  isAvailable(): boolean {
    return this.status === 'available';
  }

  /**
   * Check if seat is VIP
   */
  isVIP(): boolean {
    return this.type === 'vip';
  }

  /**
   * Check if seat is couple seat
   */
  isCoupleSeat(): boolean {
    return this.type === 'couple';
  }
}
