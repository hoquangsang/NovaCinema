/** Result of a create operation */
export interface CreateResult {
  /** The number of document(s) that were inserted */
  readonly insertedCount: number;
}

/** Result of creating a single document */
export type CreateOneResult<T> =
  | (CreateResult & {
      readonly insertedCount: 0;
      /** No document was created */
      readonly insertedItem: null;
    })
  | (CreateResult & {
      readonly insertedCount: 1;
      /** No document was created */
      readonly insertedItem: Readonly<T>;
    });

/** Result of creating multiple documents */
export type CreateManyResult<T> = CreateResult & {
  /** The inserted documents */
  readonly insertedItems: ReadonlyArray<T>;
};

/** Result of updating a single document */
export type UpdateOneResult<T> =
  | {
      readonly matchedCount: 0;
      readonly modifiedItem: null;
    }
  | {
      readonly matchedCount: 1;
      readonly modifiedItem: Readonly<T>;
    };

/** Result of updating multiple documents */
export type UpdateManyResult<T = undefined> = {
  /** The number of documents that matched the filter */
  readonly matchedCount: number;
  /** The number of document(s) that were modified */
  readonly modifiedCount: number;

  /** Extend with additional info if needed */
};

/** Result of an upsert operation */
export interface UpsertResult {
  /** True if a new document was inserted, false if an existing document was updated */
  readonly upserted: boolean;
}

/** Result of upserting a single document */
export type UpsertOneResult<T> =
  | {
      /** An existing document was created */
      readonly created: true;
      /** The newly inserted document */
      readonly upsertedItem: Readonly<T>;
    }
  | {
      /** An existing document was updated */
      readonly created: false;
      /** The updated existing document */
      readonly upsertedItem: Readonly<T>;
    };

/** Result of a delete operation */
export interface DeleteResult {
  /** Number of documents deleted */
  readonly deletedCount: number;
}

/** Result of deleting a single document */
export type DeleteOneResult = DeleteResult & {
  /** Extend with additional info if needed */
};

/** Result of deleting multiple documents */
export type DeleteManyResult = DeleteResult & {
  /** Extend with additional info if needed */
};
