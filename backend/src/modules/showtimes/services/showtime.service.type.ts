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

export type ShowtimeRange = {
  movieId: string;
  roomId: string;
  theaterId: string;
  roomType: RoomType;
  startAt: Date;
  endAt: Date;
};

export namespace ShowtimeCriteria {
  type Filter = {
    search?: never;
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
      movieId: string;
    };

  export type PaginatedQuery = PaginatedQueryInput & Filter;

  export type PaginatedQueryRange = PaginatedQueryRangeInput & Filter;

  /** */
  export type Create = {
    movieId: string;
    roomId: string;
    startAt: Date;
  };

  export type RoomSchedule = {
    roomId: string;
    startAts: Date[];
  };

  export type CreateBulk = {
    movieId: string;
    schedules: RoomSchedule[];
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
