import { applyDecorators, SetMetadata, Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiExtraModels, ApiNoContentResponse, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { CreatedResponse, ListResponse, PaginatedResponse, SuccessResponse } from '../responses';
import { METADATA_KEYS } from '../constants';

export interface ApiResponseOptions {
  dto?: Type<any>;
  message?: string;
}

export interface InternalOptions extends ApiResponseOptions {
  mode: 'ok' | 'created' | 'list' | 'paginated' | 'noContent';
}

function buildSchema(response: Type<any>, dto?: Type<any>, isArray = false, message?: string) {
  const baseProperties: Record<string, any> = {
    success: { type: 'boolean' },
    timestamp: { type: 'string', format: 'date-time' },
    message: { type: 'string', example: message ?? 'OK' },
  };
  
  if (dto) {
    baseProperties.data = isArray
      ? { type: 'array', items: { $ref: getSchemaPath(dto) } }
      : { $ref: getSchemaPath(dto) };
  }

  if (response === PaginatedResponse) {
    baseProperties.meta = {
      type: 'object',
      properties: {
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    };
  }

  return {
    type: 'object',
    properties: baseProperties,
  };
}

function createDecorator(options: InternalOptions) {
  const { dto, message, mode } = options;

  let responseClass: Type<any> | null = null;
  let swaggerDecorator: MethodDecorator | ClassDecorator;

  switch (mode) {
    case 'created':
      responseClass = CreatedResponse;
      swaggerDecorator = ApiCreatedResponse({
        schema: buildSchema(CreatedResponse, dto, false, message),
      });
      break;

    case 'list':
      responseClass = ListResponse;
      swaggerDecorator = ApiOkResponse({
        schema: buildSchema(ListResponse, dto, true, message),
      });
      break;

    case 'paginated':
      responseClass = PaginatedResponse;
      swaggerDecorator = ApiOkResponse({
        schema: buildSchema(PaginatedResponse, dto, true, message),
      });
      break;

    case 'noContent':
      swaggerDecorator = ApiNoContentResponse({
        description: options.message ?? 'No Content',
      });
      break;

    default:
      responseClass = SuccessResponse;
      swaggerDecorator = ApiOkResponse({
        schema: buildSchema(SuccessResponse, dto, false, message),
      });
  }

  const extraModels = [responseClass, dto].filter(Boolean) as Function[];

  return applyDecorators(
    ApiExtraModels(...extraModels),
    SetMetadata(METADATA_KEYS.RESPONSE_META, {
      mode,
      dto: dto ?? null,
      message: options.message ?? null,
    }),
    swaggerDecorator,
  );
}

export function WrapOkResponse(options: ApiResponseOptions = {}) {
  return createDecorator({ ...options, mode: 'ok' });
}

export function WrapListResponse(options: ApiResponseOptions = {}) {
  return createDecorator({ ...options, mode: 'list' });
}

export function WrapPaginatedResponse(options: ApiResponseOptions) {
  return createDecorator({ ...options, mode: 'paginated' });
}

export function WrapCreatedResponse(options: ApiResponseOptions = {}) {
  return createDecorator({ ...options, mode: 'created' });
}

export function WrapNoContentResponse(options: ApiResponseOptions = {}) {
  return createDecorator({ ...options, mode: 'noContent' });
}
