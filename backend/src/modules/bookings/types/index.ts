import { BOOKING_STATUSES, BOOKING_SEAT_STATUSES } from '../constants';

/** */
export type BookingSeatStatus =
  (typeof BOOKING_SEAT_STATUSES)[keyof typeof BOOKING_SEAT_STATUSES];

/** */
export type BookingStatus =
  (typeof BOOKING_STATUSES)[keyof typeof BOOKING_STATUSES];
