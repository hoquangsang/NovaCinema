import { plainToInstance } from 'class-transformer';
import { Type } from '@nestjs/common';

export const TransformUtil = {
  transformToDto<T>(dto: Type<T> | null, input: any): T | T [] | any {
    if (!dto) return input;

    if (Array.isArray(input)) {
      return input.map(item =>
        plainToInstance(dto, item, {
          excludeExtraneousValues: true,
        }),
      );
    }

    return plainToInstance(dto, input, {
      excludeExtraneousValues: true,
    });
  }
}