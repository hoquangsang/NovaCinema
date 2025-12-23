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
  CreateOneResult,
  CreateManyResult,
  UpdateOneResult,
  UpdateManyResult,
  UpsertOneResult,
  DeleteOneResult,
  DeleteManyResult,
  Creatable,
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
    data: Creatable<T>;
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
      insertedItem: flatDoc,
    };
  }

  /**
   * Create multiple documents
   * @param options.data Array of document data
   * @param options.session Optional Mongo session
   * @param options.raw If true, returns only insertedCount
   */
  public async createMany(options: {
    data: Creatable<T>[];
    session?: ClientSession;
  }): Promise<CreateManyResult<FlattenDocument<T>>> {
    const { data, session } = options;
    if (!data.length) throw new Error('Data must not be empty');

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
   * Build update query for Mongoose
   * Converts null values to $unset and defined values to $set
   * @param input Partial document data
   * @returns Mongoose update object or undefined if nothing to update
   */
  private buildUpdateQueryFromUpdate<T extends object>(input: Partial<T>) {
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
    const update = this.buildUpdateQueryFromUpdate(rawUpdate);
    if (!update) throw new Error('Missing data for update');

    const doc = await this.model
      .findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
        session,
      })
      .lean<LeanDocument<T>>()
      .exec();

    return {
      modifiedItem: mapObjectIdsToStrings(doc),
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
    const { id, update, session } = options;
    if (!isValidObjectId(id)) throw new TypeError('Invalid ObjectId');

    return this.updateOne({
      filter: { _id: id },
      update,
      session,
    });
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
    const update = this.buildUpdateQueryFromUpdate(rawUpdate);
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
   * Upsert a single document (update if exists, otherwise create)
   * @param options.filter Filter query to find document
   * @param options.update Update data
   * @param options.session Optional Mongo session
   * @returns Upserted document and whether it was created
   */
  public async upsertOne(options: {
    filter: FilterQuery<TDoc>;
    update: Partial<T>;
    session?: ClientSession;
  }): Promise<UpsertOneResult<FlattenDocument<T>>> {
    const { filter, update: rawUpdate, session } = options;

    const update = this.buildUpdateQueryFromUpdate(rawUpdate);
    if (!update) throw new Error('Missing data for upsert');

    const doc = await this.model
      .findOneAndUpdate(filter, update ?? {}, {
        new: true,
        upsert: true,
        runValidators: true,
        session,
        strict: true,
        setDefaultsOnInsert: true,
      })
      // .lean<LeanDocument<T>>()
      .exec();

    if (!doc) throw new Error('Upsert failed unexpectedly');

    return {
      upsertedItem: mapObjectIdsToStrings(doc),
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

    return { deletedCount: deletedCount > 0 ? 1 : 0 };
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
