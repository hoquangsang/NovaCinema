import {
  BOOKING_SEAT_STATES,
  BOOKING_SEAT_STATUSES,
  BOOKING_STATUSES,
} from '../constants';

/** */
export type BookingSeatStatus =
  (typeof BOOKING_SEAT_STATUSES)[keyof typeof BOOKING_SEAT_STATUSES];

/** */
export type BookingSeatState =
  (typeof BOOKING_SEAT_STATES)[keyof typeof BOOKING_SEAT_STATES];

/** */
export type BookingStatus =
  (typeof BOOKING_STATUSES)[keyof typeof BOOKING_STATUSES];
