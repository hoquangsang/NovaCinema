import { PaginatedQueryInput, QueryInput } from 'src/modules/base/services/types';

export namespace TheaterInputTypes {
  /** Filterable fields for theaters */
  export type Filter = {
    theaterName?: string;
    address?: string;
    hotline?: string;
    isActive?: boolean;
  };

  /** Input for theater queries */
  export type Query = QueryInput & Filter;

  /** Input for paginated theater queries */
  export type PaginatedQuery = PaginatedQueryInput & Filter;

  /** Input for creating a theater */
  export type Create = {
    theaterName: string;
    address?: string;
    hotline?: string;
    isActive?: boolean;
  };

  /** Input for updating a theater */
  export type Update = Partial<Create>;
}
