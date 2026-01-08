import { Types } from 'mongoose';

/**
 * Primitive types
 */
type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | Date;

/**
 * Type that behaves like ObjectId (either Mongoose ObjectId or string)
 */
type ObjectIdLike = Types.ObjectId | string;

/**
 * Converts a type T into a "creatable" form suitable for creating documents.
 * - ObjectId becomes ObjectIdLike
 * - Primitives stay the same
 * - Arrays are recursively converted
 * - Objects are recursively converted
 */
export type CreateValue<T> = T extends Types.ObjectId
  ? ObjectIdLike
  : T extends Primitive
    ? T
    : T extends Array<infer U>
      ? CreateValue<U>[]
      : T extends ReadonlyArray<infer U>
        ? ReadonlyArray<CreateValue<U>>
        : T extends object
          ? { [K in keyof T]: CreateValue<T[K]> }
          : T;

/**
 * Gets keys of T that are required (non-optional)
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Type representing the shape of data when creating a document.
 * - Required keys must be present
 * - Optional keys can be omitted
 */
export type Creatable<T> = {
  [K in RequiredKeys<T>]: CreateValue<T[K]>;
} & {
  [K in Exclude<keyof T, RequiredKeys<T>>]?: CreateValue<T[K]>;
};

/******************************/

/** Result of creating a single document */
export type CreateOneResult<T> = {
  /** The inserted document */
  readonly insertedItem: Readonly<T>;
};

/** Result of creating multiple documents */
export type CreateManyResult<T> = {
  /** The number of documents that were inserted */
  readonly insertedCount: number;
  /** The inserted documents */
  readonly insertedItems: ReadonlyArray<T>;
};

/** Result of updating a single document */
export type UpdateOneResult<T> = {
  /** The modified document, or null if no document was modified */
  readonly modifiedItem: Readonly<T> | null;
};

/** Result of updating multiple documents */
export type UpdateManyResult<T = undefined> = {
  /** The number of documents that matched the filter */
  readonly matchedCount: number;
  /** The number of documents that were modified */
  readonly modifiedCount: number;

  /** Extend with additional info if needed */
};

/** Result of upserting a single document */
export type UpsertOneResult<T> = {
  /** The upserted document */
  readonly upsertedItem: Readonly<T>;
};

/** Result of deleting a single document */
export type DeleteOneResult = {
  /** Number of documents deleted (0 or 1) */
  readonly deletedCount: 0 | 1;

  /** Extend with additional info if needed */
};

/** Result of deleting multiple documents */
export type DeleteManyResult = {
  /** Number of documents deleted */
  readonly deletedCount: number;

  /** Extend with additional info if needed */
};
