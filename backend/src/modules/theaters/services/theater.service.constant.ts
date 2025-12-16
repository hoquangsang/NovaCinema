export const TheaterQueryFields = {
  SEARCHABLE: ['theaterName', 'address'] as const,
  REGEX_MATCH: ['theaterName', 'address', 'hotline'] as const,
  ARRAY_MATCH: [] as const,
  EXACT_MATCH: ['isActive'] as const,
  SORTABLE: ['theaterName', 'address', 'hotline'] as const,
} as const;
