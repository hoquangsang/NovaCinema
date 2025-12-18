export const SEAT_TYPES = {
  NORMAL: 'NORMAL',
  VIP: 'VIP',
  COUPLE: 'COUPLE',
} as const;

export const SEAT_TYPE_VALUES = Object.values(SEAT_TYPES);

export const SEAT_MAP_EXAMPLE = [
  ...Array.from({ length: 8 }, () =>
    Array.from({ length: 10 }, () => SEAT_TYPES.NORMAL),
  ),
  [
    SEAT_TYPES.COUPLE,
    SEAT_TYPES.COUPLE,
    null,
    SEAT_TYPES.VIP,
    null,
    null,
    SEAT_TYPES.VIP,
    null,
    SEAT_TYPES.COUPLE,
    SEAT_TYPES.COUPLE,
  ],
];
