import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoleType } from "src/modules/users/constants";
import { METADATA_KEYS } from '../constants'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      METADATA_KEYS.IS_PUBLIC,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<UserRoleType[]>(
      METADATA_KEYS.ROLES,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!roles || roles.length === 0) return true;

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !Array.isArray(user.roles)) {
      throw new ForbiddenException('Invalid user roles');
    }

    const hasRole = user.roles.some((r: UserRoleType) => roles.includes(r));
    if (!hasRole) {
      throw new ForbiddenException('Role not permitted');
    }

    return true;
  }
}
