import {
  PaginatedQueryInput,
  QueryInput,
} from 'src/modules/base/services/types';
import { UserRoleType } from 'src/modules/users/types';

export namespace UserCriteria {
  type Filter = {
    email?: string;
    phoneNumber?: string;
    username?: string;
    fullName?: string;
    roles?: UserRoleType[];
    isActive?: boolean;
  };

  export type Query = QueryInput & Filter;

  export type PaginatedQuery = PaginatedQueryInput & Filter;

  export type UpdateInfo = {
    username?: string;
    fullName?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
  };
}

export namespace UserResult {
  /** */
}
