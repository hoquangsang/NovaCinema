import { PaginatedQueryInput, QueryInput } from "src/modules/base/services/types";
import { UserRoleType } from "../constants";

export namespace UserInputTypes {
  type Filter = {
    email?: string;
    phoneNumber?: string;
    username?: string;
    fullName?: string;
    roles?: UserRoleType[];
    active?: boolean;
  };

  export type Query = QueryInput & Filter;

  export type PaginatedQuery = PaginatedQueryInput & Filter;

  export type Update = {
    username?: string;
    fullName?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
  };
}
