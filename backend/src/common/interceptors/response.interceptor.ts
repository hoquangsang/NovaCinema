import { Reflector } from '@nestjs/core';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { METADATA_KEYS } from '../constants';
import { TransformUtil } from '../utils';
import { CreatedResponse, ListResponse, PaginatedResponse, SuccessResponse } from '../responses';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const meta = this.reflector.get(
      METADATA_KEYS.RESPONSE_META,
      context.getHandler()
    ) ?? {};

    const { mode, message, dto } = meta;

    return next.handle().pipe(
      map((data) => {
        switch (mode) {
          case 'created':
            return new CreatedResponse(
              TransformUtil.transformToDto(dto, data),
              message ?? 'Created'
            );

          case 'list':
            return new ListResponse(
              TransformUtil.transformToDto(dto, data),
              message ?? 'OK'
            );

          case 'paginated':
            return new PaginatedResponse(
              TransformUtil.transformToDto(dto, data.items),
              data.total,
              data.page,
              data.limit,
              message ?? 'OK'
            );

          case 'noContent':
            return null;

          default:
            return new SuccessResponse(
              TransformUtil.transformToDto(dto, data),
              message ?? 'OK'
            );
        }
      }),
    );
  }
}
