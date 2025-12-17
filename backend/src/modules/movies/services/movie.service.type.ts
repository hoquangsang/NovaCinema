import {
  DateRangeInput,
  PaginatedQueryInput,
  QueryInput,
} from 'src/modules/base/services/types';

export namespace MovieInputTypes {
  /** Filterable fields for movies */
  type Filter = {
    title?: string;
    director?: string;
    producer?: string;
    genres?: string[];
    actors?: string[];
    ratingAge?: string;
    country?: string;
    language?: string;
  };

  /** Date range fields for movies */
  export type ReleaseWindow = {
    releaseDate?: { $gte?: Date; $lte?: Date };
    endDate?: { $gte?: Date; $lte?: Date };
  };

  /** Input for movie queries */
  export type Query = QueryInput & Filter;

  /** Input for paginated movie queries */
  export type PaginatedQuery = PaginatedQueryInput & Filter;

  /** Input for paginated range movie queries */
  export type PaginatedRangeQuery = PaginatedQuery & DateRangeInput;

  /** Input for creating a movie */
  export type Create = {
    title: string;
    genres: string[];
    duration: number;
    description?: string;
    posterUrl?: string;
    trailerUrl?: string;
    releaseDate: Date;
    endDate?: Date;
    ratingAge?: string;
    country?: string;
    language?: string;
    actors?: string[];
    director?: string;
    producer?: string;
  };

  /** Input for updating a movie (all fields optional) */
  export type Update = Partial<Create>;
}
