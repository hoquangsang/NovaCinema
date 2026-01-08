import { SortFields } from './sort.type';

/** */
export interface SearchQuery {
  search?: string;
}

export interface SortQuery {
  sort?: SortFields;
}

export interface DateRangeQuery {
  from?: Date;
  to?: Date;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// interface QueryFilter {
//   search?: string;
//   sort?: SortFields;
// }

// interface PaginationFilter {
//   page?: number;
//   limit?: number;
// }

// interface DateRangeFilter {
//   from?: Date;
//   to?: Date;
// }

// /** */
// type QueryInput = QueryFilter;
// type PaginatedQueryInput = QueryInput & PaginationFilter;
// type QueryRangeInput = QueryInput & DateRangeFilter;
// type PaginatedQueryRangeInput = PaginatedQueryInput & DateRangeFilter;
