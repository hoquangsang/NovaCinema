import { UserRoleType } from 'src/modules/users/types';

export interface JwtPayload {
  readonly sub: string;
  readonly email: string;
  readonly roles: UserRoleType[];
}
