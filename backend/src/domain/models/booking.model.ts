/**
 * Domain Model: Booking
 * Represents a ticket booking by a user
 */

export type BookingStatus = 
  | 'pending'        // Just created, awaiting payment
  | 'confirmed'      // Payment successful
  | 'cancelled'      // Cancelled by user or system
  | 'expired';       // Payment timeout

export type PaymentMethod = 'credit_card' | 'debit_card' | 'e_wallet' | 'cash';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface BookedSeat {
  seatId: string;
  row: string;
  number: number;
  type: string;
  price: number;
}

export class Booking {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly showtimeId: string,
    public readonly seats: BookedSeat[],
    public readonly totalAmount: number,
    public readonly status: BookingStatus,
    public readonly paymentMethod: PaymentMethod | null,
    public readonly paymentStatus: PaymentStatus,
    public readonly paymentId: string | null,
    public readonly bookingCode: string,
    public readonly expiresAt: Date,
    public readonly confirmedAt: Date | null,
    public readonly cancelledAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Check if booking is confirmed
   */
  isConfirmed(): boolean {
    return this.status === 'confirmed' && this.paymentStatus === 'completed';
  }

  /**
   * Check if booking can be cancelled
   */
  canBeCancelled(): boolean {
    return this.status === 'confirmed' || this.status === 'pending';
  }

  /**
   * Check if booking has expired
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt && this.status === 'pending';
  }

  /**
   * Check if payment is pending
   */
  isPendingPayment(): boolean {
    return this.status === 'pending' && this.paymentStatus === 'pending';
  }

  /**
   * Get number of seats booked
   */
  getSeatCount(): number {
    return this.seats.length;
  }

  /**
   * Get seat labels
   */
  getSeatLabels(): string[] {
    return this.seats.map(seat => `${seat.row}${seat.number}`);
  }

  /**
   * Calculate refund amount (business rule: 100% if >24h before showtime, 50% if >2h, 0% otherwise)
   */
  calculateRefundAmount(showtimeStartTime: Date): number {
    const now = new Date();
    const hoursUntilShowtime = (showtimeStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilShowtime > 24) {
      return this.totalAmount; // 100% refund
    } else if (hoursUntilShowtime > 2) {
      return this.totalAmount * 0.5; // 50% refund
    }
    return 0; // No refund
  }
}
