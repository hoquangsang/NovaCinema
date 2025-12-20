export const UserQueryFields = {
  SEARCHABLE: ['username', 'fullName', 'email'],
  REGEX_MATCH: ['username', 'fullName', 'email'],
  ARRAY_MATCH: ['roles'],
  EXACT_MATCH: ['isActive', 'phoneNumber'],
  SORTABLE: ['username', 'email', 'fullName', 'createdAt', 'lastLoginAt'],
} as const;
