import { Default__v, ObjectIdToString, Require_id } from "mongoose";

/** */
/** Add _id field */
export type WithId<T> = Require_id<T>;
/** Add __v version field */
export type WithVersion<T> = Default__v<T>;


/** Sort options for document fields */
export type SortOrder = -1 | 1 | 'asc' | 'ascending' | 'desc' | 'descending';
export type SortOptions<T> = {
  [K in keyof T]?: SortOrder
};

/** Boolean-like types for projection */
export type TrueLike = 1 | true;
export type FalseLike = 0 | false;

/** Include fields in projection */
export type IncludeProjection<T> = {
  [K in keyof T]?: TrueLike
};
/** Exclude fields in projection */
export type ExcludeProjection<T> = {
  [K in keyof T]?: FalseLike
};

/** Helper to extract included keys from projection */
type IncludedKeys<T, P extends IncludeProjection<T>> = {
  [K in keyof T]: K extends keyof P
    ? P[K] extends TrueLike
      ? K
      : never
    : never
}[keyof T];
/** Helper to extract excluded keys from projection */
type ExcludedKeys<T, P extends ExcludeProjection<T>> = {
  [K in keyof T]: K extends keyof P
    ? P[K] extends FalseLike
      ? K
      : never
    : never
}[keyof T];

/** Compute resulting type based on include/exclude projection */
type ProjectionType<T, P> = 
  [P] extends [IncludeProjection<T>]
    ? Pick<T, IncludedKeys<T, P>>
    : [P] extends [ExcludeProjection<T>]
      ? Omit<T, ExcludedKeys<T, P>>
      : T;
;
// add _id + __v
export type LeanDocument<T> = WithVersion<WithId<T>>;
// apply projection
export type ProjectionLeanDocument<T, P = undefined> = ProjectionType<LeanDocument<T>, P>;

/** Convert all ObjectIds in a document to string */
export type FlattenDocument<T> = ObjectIdToString<LeanDocument<T>>;
/** Convert all ObjectIds in a projected document to string */
export type FlattenProjectionDocument<T, P = undefined> = ObjectIdToString<ProjectionLeanDocument<T, P>>;


/** Pagination result with data array and metadata */
export type PaginationResult<T> = {
  readonly items: T[],
  readonly total: number,
  readonly page: number,
  readonly limit: number,
}
