import {
  isValidObjectId,
  HydratedDocument,
  Model,
  ClientSession,
  FilterQuery,
} from 'mongoose';
import { FlattenDocument, LeanDocument } from '../query';
import { mapObjectIdsToStrings } from '../../mappers';
import {
  CreateResult,
  CreateOneResult,
  CreateManyResult,
  UpdateOneResult,
  UpdateManyResult,
  DeleteOneResult,
  DeleteManyResult,
} from './command.type';

export abstract class CommandRepository<
  T extends object,
  TDoc extends HydratedDocument<T>,
> {
  protected constructor(private readonly model: Model<TDoc>) {}

  /**
   * Create a single document
   * @param options.data Document data
   * @param options.session Optional Mongo session
   */
  public async createOne(options: {
    data: Partial<T>; // TODO: create strict type
    session?: ClientSession;
  }): Promise<CreateOneResult<FlattenDocument<T>>> {
    const { data, session } = options;
    const doc = new this.model(data);
    await doc.save({ session });

    const flatDoc = doc.toObject({
      flattenMaps: true,
      flattenObjectIds: true,
    });

    return {
      insertedCount: 1,
      insertedItem: flatDoc,
    };
  }

  /**
   * @overload
   * Create multiple documents, returns full inserted items
   * @param options.data Array of document data
   * @param options.session Optional Mongo session
   */
  public async createMany(options: {
    data: Partial<T>[];
    session?: ClientSession;
  }): Promise<CreateManyResult<FlattenDocument<T>>>;

  /**
   * @overload
   * Create multiple documents, returns only insertedCount
   * @param options.data Array of document data
   * @param options.session Optional Mongo session
   * @param options.raw If true, returns only insertedCount
   */
  public async createMany(options: {
    data: Partial<T>[];
    session?: ClientSession;
    raw: true;
  }): Promise<CreateResult>;

  /**
   * Create multiple documents
   * @param options.data Array of document data
   * @param options.session Optional Mongo session
   * @param options.raw If true, returns only insertedCount
   */
  public async createMany(options: {
    data: Partial<T>[];
    session?: ClientSession;
    raw?: boolean;
  }): Promise<CreateManyResult<FlattenDocument<T>> | CreateResult> {
    const { data, session, raw } = options;
    if (!data.length) throw new Error('Data must not be empty');

    if (raw) {
      const { insertedCount } = await this.model.insertMany(data, {
        ordered: true,
        session: session,
        rawResult: true,
      });
      return { insertedCount };
    }

    const docs = await this.model.insertMany(data, {
      ordered: true,
      session: session,
    });

    const flatDocs = docs.map((doc) => {
      return doc.toObject({
        flattenMaps: true,
        flattenObjectIds: true,
      });
    });

    return {
      insertedCount: flatDocs.length,
      insertedItems: flatDocs,
    };
  }

  /**
   * @param
   */
  private buildUpdateQuery<T extends object>(input: Partial<T>) {
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, 1> = {};

    for (const [key, value] of Object.entries(input)) {
      if (value === undefined) continue;
      if (value === null) {
        $unset[key] = 1;
      } else {
        $set[key] = value;
      }
    }

    const update: Record<string, any> = {};
    if (Object.keys($set).length) update.$set = $set;
    if (Object.keys($unset).length) update.$unset = $unset;

    return Object.keys(update).length ? update : undefined;
  }

  /**
   * Update a single document by filter
   * @param options.filter Filter query
   * @param options.update Update query
   * @param options.session Optional Mongo session
   */
  public async updateOne(options: {
    filter: FilterQuery<TDoc>;
    update: Partial<T>;
    session?: ClientSession;
  }): Promise<UpdateOneResult<FlattenDocument<T>>> {
    const { filter, update: rawUpdate, session } = options;
    const update = this.buildUpdateQuery(rawUpdate);
    if (!update) {
      return {
        matchedCount: 0,
        modifiedCount: 0,
        modifiedItem: null,
      };
    }

    const leanDoc: LeanDocument<T> | null = await this.model
      .findOneAndUpdate(filter, update, {
        runValidators: true,
        new: true,
        session: session,
      })
      .lean<LeanDocument<T>>()
      .exec();

    if (!leanDoc) {
      return {
        matchedCount: 0,
        modifiedCount: 0,
        modifiedItem: null,
      };
    }

    return {
      matchedCount: 1,
      modifiedCount: 1,
      modifiedItem: mapObjectIdsToStrings(leanDoc),
    };
  }

  /**
   * Update a single document by ID
   * @param options.id Document ID
   * @param options.update Update query
   * @param options.session Optional Mongo session
   */
  public async updateOneById(options: {
    id: string;
    update: Partial<T>;
    session?: ClientSession;
  }): Promise<UpdateOneResult<FlattenDocument<T>>> {
    const { id, update: rawUpdate, session } = options;
    if (!isValidObjectId(id)) throw new TypeError('Invalid ObjectId');

    const update = this.buildUpdateQuery(rawUpdate);
    if (!update) {
      return {
        matchedCount: 0,
        modifiedCount: 0,
        modifiedItem: null,
      };
    }

    const leanDoc: LeanDocument<T> | null = await this.model
      .findByIdAndUpdate(id, update, {
        runValidators: true,
        new: true,
        session: session,
      })
      .lean<LeanDocument<T>>()
      .exec();

    if (!leanDoc) {
      return {
        matchedCount: 0,
        modifiedCount: 0,
        modifiedItem: null,
      };
    }

    return {
      matchedCount: 1,
      modifiedCount: 1,
      modifiedItem: mapObjectIdsToStrings(leanDoc),
    };
  }

  /**
   * Update multiple documents
   * @param options.filter Filter query
   * @param options.update Update query
   * @param options.session Optional Mongo session
   */
  public async updateMany(options: {
    filter: FilterQuery<TDoc>;
    update: Partial<T>;
    session?: ClientSession;
  }): Promise<UpdateManyResult> {
    const { filter, update: rawUpdate, session } = options;
    const update = this.buildUpdateQuery(rawUpdate);
    if (!update) {
      return {
        matchedCount: 0,
        modifiedCount: 0,
      };
    }

    const result = await this.model
      .updateMany(filter, update, {
        runValidators: true,
        raw: false,
        session: session,
      })
      .exec();

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  /**
   * Delete a single document by filter
   * @param options.filter Filter query
   * @param options.session Optional Mongo session
   */
  public async deleteOne(options: {
    filter: FilterQuery<TDoc>;
    session?: ClientSession;
  }): Promise<DeleteOneResult> {
    const { filter, session } = options;
    const { deletedCount } = await this.model
      .deleteOne(filter, { session })
      .exec();

    return { deletedCount };
  }

  /**
   * Delete a single document by ID
   * @param options.id Document ID
   * @param options.session Optional Mongo session
   */
  public async deleteOneById(options: {
    id: string;
    session?: ClientSession;
  }): Promise<DeleteOneResult> {
    const { id, session } = options;
    if (!isValidObjectId(id)) throw new TypeError('Invalid ObjectId');

    return this.deleteOne({
      filter: { _id: id },
      session: session,
    });
  }

  /**
   * Delete multiple documents
   * @param options.filter Filter query
   * @param options.session Optional Mongo session
   */
  public async deleteMany(options: {
    filter: FilterQuery<TDoc>;
    session?: ClientSession;
  }): Promise<DeleteManyResult> {
    const { filter, session } = options;
    const { deletedCount } = await this.model
      .deleteMany(filter, { session })
      .exec();

    return { deletedCount };
  }
}
