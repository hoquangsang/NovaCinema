export type SortDirection = 'asc' | 'desc';

export type SortBy<T> = {
  [K in keyof T]?: SortDirection;
};

export type SortFields = Record<string, SortDirection>;
