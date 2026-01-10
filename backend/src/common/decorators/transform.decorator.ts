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

/**
 * Transform sort query:
 *  - field:asc
 *  - field:desc
 *  - field:1
 *  - field:-1
 *  - multiple via array or comma
 *
 * Output:
 *  { field: 'asc' | 'desc' }
 */
type SortDirection = 'asc' | 'desc';

const normalizeSortOrder = (v: string | number): SortDirection | undefined => {
  if (v === 1 || v === '1') return 'asc';
  if (v === -1 || v === '-1') return 'desc';

  const s = String(v).toLowerCase();
  if (s === 'asc' || s === 'desc') return s;
};

export function ToSortObject() {
  return applyDecorators(
    Transform(({ value }) => {
      if (!value) return undefined;

      const rawParts = Array.isArray(value) ? value : [value];

      const flattened = rawParts
        .flatMap((v) => String(v).split(','))
        .map((v) => v.trim())
        .filter(Boolean);

      const entries: [string, SortDirection][] = [];

      for (const part of flattened) {
        const [key, raw] = part.split(':').map((s) => s.trim());
        if (!key || !raw) continue;

        const order = normalizeSortOrder(raw);
        if (!order) continue;

        entries.push([key, order]);
      }

      return entries.length ? Object.fromEntries(entries) : undefined;
    }),
  );
}
