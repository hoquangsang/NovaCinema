/** Result of a create operation */
export interface CreateResult {
  /** The number of document(s) that were inserted */
  readonly insertedCount: number;
};

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

// export type CreateOneResult<T> = CreateResult & {
//   /** The inserted document */
//   readonly insertedItem: Readonly<T>;
// };


/** Result of creating multiple documents */
export type CreateManyResult<T> = CreateResult & {
  /** The inserted documents */
  readonly insertedItems: ReadonlyArray<T>;
};

/** Result of an update operation */
export interface UpdateResult {
  /** The number of documents that matched the filter */
  readonly matchedCount: number;
  /** The number of document(s) that were modified */
  readonly modifiedCount: number;
};

/** Result of updating a single document */
export type UpdateOneResult<T> = 
  | (UpdateResult & {
      readonly matchedCount: 0;
      readonly modifiedCount: 0;
      /** No document was modified */
      readonly modifiedItem: null
    })
  | (UpdateResult & {
      readonly matchedCount: 1;
      readonly modifiedCount: 0;
      /** No document was modified */
      readonly modifiedItem: null
    })
  | (UpdateResult & {
      readonly matchedCount: 1;
      /** The updated document */
      readonly modifiedCount: 1;
      readonly modifiedItem: Readonly<T>
    });

/** Result of updating multiple documents */
export type UpdateManyResult<T = undefined> = UpdateResult & {
  /** Extend with additional info if needed */
};

/** Result of a delete operation */
export interface DeleteResult {
  /** Number of documents deleted */
  readonly deletedCount: number;
};

/** Result of deleting a single document */
export type DeleteOneResult = DeleteResult & {
  /** Extend with additional info if needed */
};

/** Result of deleting multiple documents */
export type DeleteManyResult = DeleteResult & {
  /** Extend with additional info if needed */
};
