export const SHOWTIME_GAP_MIN = 10;

export const SHOWTIME_ROUND_STEP_MIN = 5;

export const SHOWTIME_QUERY_FIELDS = {
  SEARCHABLE: [] as readonly string[],
  REGEX_MATCH: [] as readonly string[],
  ARRAY_MATCH: [] as readonly string[],
  EXACT_MATCH: ['isActive'],
  SORTABLE: ['startAt'],
} as const;
