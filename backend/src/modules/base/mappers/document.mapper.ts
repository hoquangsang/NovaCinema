import { ObjectIdToString } from 'mongoose';
import { Types } from 'mongoose';

export function mapObjectIdsToStrings<T>(
  value: readonly T[],
): ObjectIdToString<T>[];

export function mapObjectIdsToStrings<T>(value: T): ObjectIdToString<T>;

/** Map ObjectIds in a value to strings, preserving structure */
export function mapObjectIdsToStrings(value: unknown): unknown {
  if (value == null) return value;

  if (value instanceof Types.ObjectId) return value.toHexString();

  if (value instanceof Date) return value;

  if (Buffer.isBuffer(value)) return value;

  if (value instanceof RegExp) return value;

  if (value instanceof Map) {
    return new Map(
      Array.from(value.entries()).map(([k, v]) => [
        mapObjectIdsToStrings(k),
        mapObjectIdsToStrings(v),
      ]),
    );
  }

  if (value instanceof Set) {
    return new Set(Array.from(value.values()).map(mapObjectIdsToStrings));
  }

  if (Array.isArray(value)) {
    return value.map(mapObjectIdsToStrings);
  }

  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = mapObjectIdsToStrings(v);
    }
    return out;
  }

  return value;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
