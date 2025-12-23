import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

/**
 * Transform "true" | "false" (or array) → boolean
 */
export function ToBoolean() {
  return applyDecorators(
    Transform(({ value }) => {
      const parse = (v: unknown) => {
        if (v === 'true') return true;
        if (v === 'false') return false;
        return v;
      };

      return Array.isArray(value) ? value.map(parse) : parse(value);
    }),
  );
}

/**
 * Transform ISO date-time string (or array) → Date
 * Invalid values are kept for validator to reject
 */
export function ToDateTime() {
  return applyDecorators(
    Transform(({ value }) => {
      const parse = (v: unknown) => {
        if (typeof v !== 'string') return v;
        const d = new Date(v);
        return isNaN(d.getTime()) ? v : d;
      };

      return Array.isArray(value) ? value.map(parse) : parse(value);
    }),
  );
}

/**
 * Coerce value to array
 * string -> [string], array -> array
 */
export function ToArray() {
  return applyDecorators(
    Transform(({ value }) => {
      if (value == null) return value;
      return Array.isArray(value) ? value : [value];
    }),
  );
}
