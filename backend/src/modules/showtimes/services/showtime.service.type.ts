import { TimeHHmm } from 'src/common/types';
import {
  QueryInput,
  PaginatedQueryInput,
  QueryRangeInput,
  PaginatedQueryRangeInput,
} from 'src/modules/base/services/types';
import { RoomType } from 'src/modules/theaters/types';

export interface MovieLike {
  _id: string;
  duration: number;
  releaseDate: Date;
  endDate?: Date;
}

export interface RoomLike {
  _id: string;
  theaterId: string;
  roomName: string;
  roomType: RoomType;
}

export interface ShowtimeLike {
  _id: string;
  movieId: string;
  theaterId: string;
  roomId: string;
  roomType: RoomType;
  startAt: Date;
  endAt: Date;
  isActive?: Boolean;
}

export interface Range {
  startAt: Date;
  endAt: Date;
}

export namespace ShowtimeCriteria {
  type Filter = {
    search?: never;
    sort?: never;
    movieId?: string;
    theaterId?: string;
    roomId?: string;
    isActive?: boolean;
  };

  export type Query = QueryInput & Filter;

  export type QueryRange = QueryRangeInput & Filter;

  export type QueryByDate = QueryInput &
    Filter & {
      date: Date;
    };

  export type QueryAvailable = QueryInput &
    Filter & {
      date?: Date;
    };

  export type PaginatedQuery = PaginatedQueryInput & Filter;

  export type PaginatedQueryRange = PaginatedQueryRangeInput & Filter;

  /** */
  export type Create = {
    movieId: string;
    roomId: string;
    startAt: Date;
  };

  export type CreateBulk = {
    movieId: string;
    roomIds: string[];
    startAts: Date[];
  };

  export type CreateRepeated = {
    movieId: string;
    roomIds: string[];
    repeatDates: Date[];
    startTimes: TimeHHmm[];
  };

  /** */
  export type Update = {
    movieId: string;
    roomId: string;
    startAt: Date;
  };

  /** */
  export type DeleteBulk = {
    ids: string[];
  };
}

export namespace ShowtimeResult {
  export type ValidationError = {
    // TODO: BaseResult
    field?: string;
    messages: string[];
    code?: string;
  };

  export type ValidationSuccess = {
    valid: true;
    message?: string;
  };

  export type ValidationFailure = {
    valid: false;
    field?: string;
    errors: string[];
    message?: string;
  };

  export type Validation = ValidationSuccess | ValidationFailure;

  export type ValidationResult<T> =
    | (ValidationSuccess & { value: T })
    | (ValidationFailure & { value?: never });
}
