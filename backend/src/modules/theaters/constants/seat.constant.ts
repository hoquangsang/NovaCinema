export const SEAT_TYPES = ['NORMAL', 'VIP', 'COUPLE'] as const;
export type SeatType = typeof SEAT_TYPES[number];
