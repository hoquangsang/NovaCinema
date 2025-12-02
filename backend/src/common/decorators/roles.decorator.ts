import { SetMetadata } from "@nestjs/common";
import { META } from '../constants'

export const Roles = (...roles: string[]) => SetMetadata(META.ROLES, roles);
