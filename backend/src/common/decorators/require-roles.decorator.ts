import { SetMetadata } from '@nestjs/common';
import { UserRoleType } from 'src/modules/users/types';
import { METADATA_KEYS } from '../constants';

export const RequireRoles = (...roles: UserRoleType[]) =>
  SetMetadata(METADATA_KEYS.ROLES, roles);
