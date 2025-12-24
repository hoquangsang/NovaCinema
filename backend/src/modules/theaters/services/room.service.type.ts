import {
  PaginatedQueryInput,
  QueryInput,
} from 'src/modules/base/services/types';
import { RoomType, SeatType } from '../types';

export namespace RoomCriteria {
  /** Filterable fields for rooms */
  export type Filter = {
    roomName?: string;
    roomType?: RoomType[];
    isActive?: boolean;
  };

  /** Input for room queries */
  export type Query = QueryInput & Filter;

  /** Input for paginated room queries */
  export type PaginatedQuery = PaginatedQueryInput & Filter;

  /** Input for creating a room */
  export type Create = {
    roomName: string;
    roomType?: RoomType;
    seatMap: (SeatType | null)[][];
  };

  /** Input for updating a room */
  export type Update = {
    roomName?: string;
    roomType?: RoomType;
    seatMap?: (SeatType | null)[][];
    isActive?: boolean;
  };
}

export namespace RoomResult {
  /** */
}
