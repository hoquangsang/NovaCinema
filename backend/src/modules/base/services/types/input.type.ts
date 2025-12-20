import { SortDirection } from './sort.type';

/** */
export type QueryInput = {
  search?: string;
  sort?: Record<string, SortDirection>;
};

/** */
export type PaginationInput = {
  page?: number;
  limit?: number;
};

/** */
export type PaginatedQueryInput = QueryInput & PaginationInput;

/** */
export type DateRangeInput = {
  startDate?: Date;
  endDate?: Date;
};

/** */
export type DatetimeRangeInput = {
  startDatetime?: Date;
  endDatetime?: Date;
};
