export const BOOKING_SEAT_STATUSES = {
  HOLDING: 'HOLDING',
  SOLD: 'SOLD',
} as const;

export const BOOKING_SEAT_STATUS_VALUES = Object.values(BOOKING_SEAT_STATUSES);

/** */
export const BOOKING_SEAT_STATES = {
  FREE: 'FREE',
  HOLD: 'HOLD',
  SOLD: 'SOLD',
} as const;

export const BOOKING_SEAT_STATE_VALUES = Object.values(BOOKING_SEAT_STATES);

/** */
export const BOOKING_STATUSES = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;

export const BOOKING_STATUS_VALUES = Object.values(BOOKING_STATUSES);

/** */
export const BOOKING_LIMITS = {
  MAX_SEATS_PER_BOOKING: 5,
} as const;

export const BOOKING_TIMINGS = {
  EXPIRE_MINUTES: 5,
} as const;
