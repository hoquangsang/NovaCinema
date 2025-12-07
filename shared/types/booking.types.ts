/**
 * Shared Types: Booking
 * Types dùng chung giữa Backend và Frontend
 */

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'expired';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'e_wallet' | 'cash';

export interface BookedSeatDto {
  seatId: string;
  row: string;
  number: number;
  type: string;
  price: number;
}

export interface BookingDto {
  _id: string;
  userId: string;
  showtimeId: string;
  seats: BookedSeatDto[];
  totalAmount: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod | null;
  paymentStatus: PaymentStatus;
  bookingCode: string;
  expiresAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  createdAt: string;
}

export interface CreateBookingDto {
  showtimeId: string;
  seatIds: string[];
}

export interface ConfirmBookingDto {
  paymentId: string;
}
