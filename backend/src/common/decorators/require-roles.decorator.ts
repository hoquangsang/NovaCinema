import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/users/types';
import { METADATA_KEYS } from '../constants';

export const RequireRoles = (...roles: UserRole[]) =>
  SetMetadata(METADATA_KEYS.ROLES, roles);
