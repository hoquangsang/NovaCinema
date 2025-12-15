import { Reflector } from '@nestjs/core';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Type } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { METADATA_KEYS } from '../constants';
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
              this.transformToDto(dto, data),
              message ?? 'Created'
            );

          case 'list':
            return new ListResponse(
              this.transformToDto(dto, data),
              message ?? 'OK'
            );

          case 'paginated':
            return new PaginatedResponse(
              this.transformToDto(dto, data.items),
              data.total,
              data.page,
              data.limit,
              message ?? 'OK'
            );

          case 'noContent':
            return null;

          default:
            return new SuccessResponse(
              this.transformToDto(dto, data),
              message ?? 'OK'
            );
        }
      }),
    );
  }

  private transformToDto<T>(dto: Type<T> | null, input: any): T | T[] | any {
    if (!dto) return input;

    if (Array.isArray(input)) {
      return input.map(item =>
        plainToInstance(dto, item, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
      );
    }

    return plainToInstance(dto, input, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
