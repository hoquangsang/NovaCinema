export const USERROLE_TYPES = ['USER', 'ADMIN'] as const;
export type UserRoleType = typeof USERROLE_TYPES[number];
