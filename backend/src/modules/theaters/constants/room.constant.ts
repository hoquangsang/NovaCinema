export const ROOM_TYPES = ['2D', '3D', 'VIP'] as const;
export const ROOM_LIMITS = {
  MIN_ROWS: 6,
  MAX_ROWS: 30,
  MIN_SEATS_PER_ROW: 6,
  MAX_SEATS_PER_ROW: 30
} as const;

export type RoomType = typeof ROOM_TYPES[number];
