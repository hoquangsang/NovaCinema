import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { METADATA_KEYS } from '../constants'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(
      METADATA_KEYS.ROLES,
      ctx.getHandler()
    );
    if (!roles) return true;

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !Array.isArray(user.roles)) {
      throw new ForbiddenException('Invalid user roles');
    }

    const hasRole = user.roles.some((r: string) => roles.includes(r));
    if (!hasRole) {
      throw new ForbiddenException('Role not permitted');
    }

    return true;
  }
}
