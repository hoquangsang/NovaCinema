import {
  isValidObjectId,
  HydratedDocument, Model,
  ClientSession, FilterQuery,
} from "mongoose";
import {
  mapObjectIdsToStrings
} from "../../mappers";
import {
  ExcludeProjection, IncludeProjection,
  LeanDocument, FlattenDocument, FlattenProjectionDocument,
  SortOptions, PaginationResult
} from "./query.type";

export abstract class QueryRepository<
  T extends object,
  TDoc extends HydratedDocument<T>,
> {
  /**
   * Constructor
   * @param model Mongoose model
   */
  protected constructor(
    private readonly model: Model<TDoc>
  ) {}

  /**
   * Check if any document matches the filter
   * @param options.filter Filter query
   * @param options.session Optional Mongo session
   */
  public async exists(options: {
    filter: FilterQuery<TDoc>;
    session?: ClientSession;
  }): Promise<boolean> {
    const { filter = {}, session = null } = options;
    const x = await this.model
      .exists(filter)
      .session(session)
      .exec();
    return !!x;
  }

  /**
   * Count documents matching the filter
   * @param options.filter Filter query
   * @param options.session Optional Mongo session
   */
  public async count(options: {
    filter: FilterQuery<TDoc>;
    session?: ClientSession;
  }): Promise<number> {
    const { filter = {}, session } = options;
    return this.model
      .countDocuments(filter, { session })
      .exec();
  }


  /********************************
   * @overload
   */
  public async findOne(options: {
    filter: FilterQuery<TDoc>;
    session?: ClientSession;
  }): Promise<FlattenDocument<T> | null>;

  /**
   * @overload
   */
  public async findOne<P extends IncludeProjection<LeanDocument<T>>>(options: {
    filter: FilterQuery<TDoc>;
    inclusion: P;
    session?: ClientSession;
  }): Promise<FlattenProjectionDocument<T, P> | null>;

  /**
   * @overload
   */
  public async findOne<P extends ExcludeProjection<LeanDocument<T>>>(options: {
    filter: FilterQuery<TDoc>;
    exclusion: P;
    session?: ClientSession;
  }): Promise<FlattenProjectionDocument<T, P> | null>;

  /**
   * Find a single document by filter
   * @param options.filter Filter query
   * @param options.inclusion Optional inclusion projection
   * @param options.exclusion Optional exclusion projection
   * @param options.session Optional Mongo session
   */
  public async findOne(options: any = {}): Promise<any> {
    const { filter = {}, inclusion, exclusion, session } = options;
    const projection = inclusion ?? exclusion ?? undefined;
    const leanDoc: LeanDocument<T> | null = await this.model
      .findOne(filter, projection, { session })
      .lean<LeanDocument<T>>()
      .exec();

    return mapObjectIdsToStrings(leanDoc);
  }

  /********************************
   * @overload
   */
  public async findOneById(options: {
    id: string;
    session?: ClientSession;
  }): Promise<FlattenDocument<T> | null>;

  /**
   * @overload
   */
  public async findOneById<P extends IncludeProjection<LeanDocument<T>>>(options: {
    id: string;
    inclusion: P;
    session?: ClientSession;
  }): Promise<FlattenProjectionDocument<T, P> | null>;

  /**
   * @overload
   */
  public async findOneById<P extends ExcludeProjection<LeanDocument<T>>>(options: {
    id: string;
    exclusion: P;
    session?: ClientSession;
  }): Promise<FlattenProjectionDocument<T, P> | null>;

  /**
   * Find a single document by ID
   * @param options.id Document ID
   * @param options.inclusion Optional inclusion projection
   * @param options.exclusion Optional exclusion projection
   * @param options.session Optional Mongo session
   */
  public async findOneById(options: any = {}): Promise<any> {
    const { id, inclusion, exclusion, session } = options;
    if (!isValidObjectId(id)) return null;
    const projection = inclusion ?? exclusion ?? undefined;
    const leanDoc: LeanDocument<T> | null = await this.model
      .findById(id, projection, { session })
      .lean<LeanDocument<T>>()
      .exec();

    return mapObjectIdsToStrings(leanDoc);
  }


  /********************************
   * @overload
   */
  public async findMany(options: {
    filter?: FilterQuery<TDoc>;
    sort?: SortOptions<T>;
    session?: ClientSession;
  }): Promise<FlattenDocument<T>[]>;

  /**
   * @overload
   */
  public async findMany<P extends IncludeProjection<LeanDocument<T>>>(options: {
    filter?: FilterQuery<TDoc>;
    sort?: SortOptions<T>;
    inclusion: P;
    session?: ClientSession;
  }): Promise<FlattenProjectionDocument<T, P>[]>;

  /**
   * @overload
   */
  public async findMany<P extends ExcludeProjection<LeanDocument<T>>>(options: {
    filter?: FilterQuery<TDoc>;
    sort?: SortOptions<T>;
    exclusion: P;
    session?: ClientSession;
  }): Promise<FlattenProjectionDocument<T, P>[]>;

  /**
   * Find multiple documents by filter
   * @param options.filter Optional filter query
   * @param options.sort Optional sort
   * @param options.inclusion Optional inclusion projection
   * @param options.exclusion Optional exclusion projection
   * @param options.session Optional Mongo session
   */
  public async findMany(options: any = {}): Promise<any[]> {
    const { filter = {}, sort, inclusion, exclusion, session } = options;
    const projection = inclusion ?? exclusion ?? undefined;
    const leanDocs = await this.findLean({
      filter, projection, sort, session
    });
    return mapObjectIdsToStrings(leanDocs);
  }


  /********************************
   * @overload
   */
  public async findManyPaginated(options: {
    filter?: FilterQuery<TDoc>;
    sort?: SortOptions<T>;
    page?: number;
    limit?: number;
    session?: ClientSession;
  }): Promise<PaginationResult<FlattenDocument<T>>>;

  /**
   * @overload
   */
  public async findManyPaginated<P extends IncludeProjection<LeanDocument<T>>>(options: {
    filter?: FilterQuery<TDoc>;
    sort?: SortOptions<T>;
    page?: number;
    limit?: number;
    inclusion: P;
    session?: ClientSession;
  }): Promise<PaginationResult<FlattenProjectionDocument<T, P>>>;

  /**
   * @overload
   */
  public async findManyPaginated<P extends ExcludeProjection<LeanDocument<T>>>(options: {
    filter?: FilterQuery<TDoc>;
    sort?: SortOptions<T>;
    page?: number;
    limit?: number;
    exclusion: P;
    session?: ClientSession;
  }): Promise<PaginationResult<FlattenProjectionDocument<T, P>>>;

  /**
   * Find multiple documents with pagination
   * @param options.filter Optional filter query
   * @param options.sort Optional sort
   * @param options.page Page number
   * @param options.limit Page size
   * @param options.inclusion Optional inclusion projection
   * @param options.exclusion Optional exclusion projection
   * @param options.session Optional Mongo session
   */
  public async findManyPaginated(options: any = {}): Promise<any> {
    const { filter = {}, sort, page = 1, limit = 10, inclusion, exclusion, session } = options;
    const projection = inclusion ?? exclusion ?? undefined;
    const skip = Math.max((page - 1) * limit, 0);
    const [leanDocs, total] = await Promise.all([
      this.findLean({
        filter, projection, sort, skip, limit, session
      }),
      this.count({
        filter, session
      }),
    ]);
    const items = mapObjectIdsToStrings(leanDocs);
    return { items, total, page, limit };
  }

  /********************************
   * Internal method to find lean documents
   * @param options.filter Optional filter query
   * @param options.projection Optional projection
   * @param options.sort Optional sort options
   * @param options.skip Optional skip for pagination
   * @param options.limit Optional limit for pagination
   * @param options.session Optional Mongo session
   */
  private async findLean(options: {
    filter?: FilterQuery<TDoc>;
    projection?: any;
    sort?: SortOptions<T>;
    skip?: number;
    limit?: number;
    session?: ClientSession;
  }): Promise<LeanDocument<T>[]> {
    const { filter = {}, projection, sort, skip, limit, session } = options;
    return this.model
      .find(filter, projection, {
        sort, skip, limit, session
      })
      .lean<LeanDocument<T>[]>()
      .exec();
  }
}
