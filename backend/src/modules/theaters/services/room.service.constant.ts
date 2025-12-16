export const RoomQueryFields = {
  SEARCHABLE: ['roomName'] as const,
  REGEX_MATCH: ['roomName'] as const,
  ARRAY_MATCH: ['roomType'] as const,
  EXACT_MATCH: ['isActive'] as const,
  SORTABLE: ['roomName', 'roomType'] as const,
} as const;
