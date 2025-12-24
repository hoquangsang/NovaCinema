export const ROOM_TYPES = {
  _2D: '2D',
  _3D: '3D',
  VIP: 'VIP',
} as const;

export const ROOM_TYPE_VALUES = Object.values(ROOM_TYPES);

export const ROOM_LIMITS = {
  MIN_ROWS: 6,
  MAX_ROWS: 30,
  MIN_SEATS_PER_ROW: 6,
  MAX_SEATS_PER_ROW: 30,
} as const;
