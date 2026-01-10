import { UserRole } from 'src/modules/users/types';

export interface JwtPayload {
  readonly sub: string;
  readonly email: string;
  readonly roles: UserRole[];
}
