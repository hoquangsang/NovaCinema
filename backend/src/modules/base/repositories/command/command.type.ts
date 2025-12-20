/** Result of creating a single document */
export type CreateOneResult<T> = {
  /** The inserted documents */
  readonly insertedItem: Readonly<T>;
};

/** Result of creating multiple documents */
export type CreateManyResult<T> = {
  /** The number of document(s) that were inserted */
  readonly insertedCount: number;
  /** The inserted documents */
  readonly insertedItems: ReadonlyArray<T>;
};

/** Result of updating a single document */
export type UpdateOneResult<T> = {
  /** The modified documents */
  readonly modifiedItem: Readonly<T> | null;
};

/** Result of updating multiple documents */
export type UpdateManyResult<T = undefined> = {
  /** The number of documents that matched the filter */
  readonly matchedCount: number;
  /** The number of document(s) that were modified */
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
  /** Number of documents deleted */
  readonly deletedCount: 0 | 1;

  /** Extend with additional info if needed */
};

/** Result of deleting multiple documents */
export type DeleteManyResult = {
  /** Number of documents deleted */
  readonly deletedCount: number;

  /** Extend with additional info if needed */
};
