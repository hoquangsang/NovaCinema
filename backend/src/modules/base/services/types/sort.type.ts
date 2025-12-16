export type SortDirection = 'asc' | 'desc';
export type SortByInput<T> = {
  [K in keyof T]?: SortDirection
};
