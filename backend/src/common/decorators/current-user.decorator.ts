import { createParamDecorator } from '@nestjs/common';
import { JwtPayload } from 'src/modules/auth/types';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtPayload;
  },
);
