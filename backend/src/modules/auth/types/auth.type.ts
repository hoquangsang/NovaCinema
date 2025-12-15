import { UserRoleType } from "src/modules/users/constants";

export interface JwtPayload {
  readonly sub: string;
  readonly email: string;
  readonly roles: UserRoleType[];
}
