import { BOOKING_SEAT_STATES, BOOKING_SEAT_STATUSES } from '../constants';
import { BookingSeatState, BookingSeatStatus } from '../types';

export const toSeatState = (status?: BookingSeatStatus): BookingSeatState => {
  if (status === BOOKING_SEAT_STATUSES.SOLD) return BOOKING_SEAT_STATES.SOLD;

  if (status === BOOKING_SEAT_STATUSES.HOLDING) return BOOKING_SEAT_STATES.HOLD;

  return BOOKING_SEAT_STATES.FREE;
};
