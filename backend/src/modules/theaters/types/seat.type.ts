import { SEAT_TYPES } from '../constants';

export type SeatType = (typeof SEAT_TYPES)[keyof typeof SEAT_TYPES];
