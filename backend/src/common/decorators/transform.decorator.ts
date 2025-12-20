import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

/**
 * Transform query string "true" | "false" → boolean
 */
export function ToBoolean() {
  return applyDecorators(
    Transform(({ value }) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    }),
  );
}

/**
 * Transform ISO date-time string → Date
 * Accepts only valid Date string, otherwise keeps original value
 */
export function ToDateTime() {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;

      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date;
    }),
  );
}

/**
 * Transform yyyy-MM-dd → Date at start of day (UTC)
 */
export function ToDateOnlyStart() {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

      const date = new Date(`${value}T00:00:00.000Z`);
      return isNaN(date.getTime()) ? value : date;
    }),
  );
}

/**
 * Transform yyyy-MM-dd → Date at end of day (UTC)
 */
export function ToDateOnlyEnd() {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

      const date = new Date(`${value}T23:59:59.999Z`);
      return isNaN(date.getTime()) ? value : date;
    }),
  );
}

/**
 * Coerce query value to array
 * - string -> [string]
 * - array  -> array
 * - others -> keep original value
 */
export function ToArray() {
  return applyDecorators(
    Transform(({ value }) => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return [value];
      return value;
    }),
  );
}
