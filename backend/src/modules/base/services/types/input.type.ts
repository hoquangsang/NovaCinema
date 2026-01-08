import { SortDirection } from './sort.type';

/** */
type QueryFilter = {
  search?: string;
  sort?: Record<string, SortDirection>;
};

type PaginationFilter = {
  page?: number;
  limit?: number;
};

type DateRangeFilter = {
  from?: Date;
  to?: Date;
};

/** */
export type QueryInput = QueryFilter;

export type PaginatedQueryInput = QueryInput & PaginationFilter;

export type QueryRangeInput = QueryInput & DateRangeFilter;

export type PaginatedQueryRangeInput = PaginatedQueryInput & DateRangeFilter;
