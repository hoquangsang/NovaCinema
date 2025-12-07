import {
  Document,
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
} from "mongoose";

export type WithId<T> = T & { _id: string };

export abstract class BaseRepository<T, TDoc extends Document & T> {
  protected constructor(
    protected readonly model: Model<TDoc>
  ) {}

  private isValidObjectId(id: string) {
    return Types.ObjectId.isValid(id);
  }

  private convertId(doc: unknown): WithId<T> | null {
    if (!doc || typeof doc !== "object") return null;

    const d: any = doc;
    const id = d._id?.toString?.();
    if (!id) return null;

    return { ...(d as T), _id: id };
  }

  private convertIdArray(docs: unknown[]): WithId<T>[] {
    return docs
      .map((d) => this.convertId(d))
      .filter((x): x is WithId<T> => x !== null);
  }

  protected async findById(id: string): Promise<WithId<T> | null> {
    if (!this.isValidObjectId(id)) return null;
    const doc = await this.model.findById(id).lean().exec();
    return this.convertId(doc);
  }

  protected async findOne(filter: FilterQuery<TDoc>): Promise<WithId<T> | null> {
    const doc = await this.model.findOne(filter).lean().exec();
    return this.convertId(doc);
  }

  protected async findMany(filter: FilterQuery<TDoc>): Promise<WithId<T>[]> {
    const docs = await this.model.find(filter).lean().exec();
    return this.convertIdArray(docs);
  }

  protected async findAll(): Promise<WithId<T>[]> {
    return this.findMany({});
  }

  protected async findPaginated(options: {
    filter?: FilterQuery<TDoc>;
    sort?: Record<string, 1 | -1>;
    page?: number;
    limit?: number;
  }): Promise<{ items: WithId<T>[]; total: number }> {
    const {
      filter = {},
      sort = { createdAt: -1 },
      page = 1,
      limit = 10,
    } = options;

    const skip = Math.max((page - 1) * limit, 0);

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      items: this.convertIdArray(items),
      total,
    };
  }

  protected async create(data: Partial<T>): Promise<WithId<T>> {
    const doc = await this.model.create(data);
    const plain = doc.toObject({ flattenMaps: true });
    return this.convertId(plain)!;
  }

  protected async createMany(data: Partial<T>[]): Promise<WithId<T>[]> {
    if (!Array.isArray(data) || data.length === 0) return [];

    const docs = await this.model.insertMany(data, { ordered: true });
    const plain = docs.map((d) => d.toObject({ flattenMaps: true }));

    return this.convertIdArray(plain);
  }

  protected async updateOne(
    filter: FilterQuery<TDoc>,
    updates: UpdateQuery<TDoc>
  ): Promise<WithId<T> | null> {
    const doc = await this.model
      .findOneAndUpdate(filter, updates, {
        new: true,
        lean: true,
        runValidators: true,
      })
      .exec();

    return this.convertId(doc);
  }

  protected async updateById(
    id: string,
    updates: UpdateQuery<TDoc>
  ): Promise<WithId<T> | null> {
    if (!this.isValidObjectId(id)) return null;

    const doc = await this.model
      .findByIdAndUpdate(id, updates, {
        new: true,
        lean: true,
        runValidators: true,
      })
      .exec();

    return this.convertId(doc);
  }

  protected async deleteById(id: string): Promise<boolean> {
    if (!this.isValidObjectId(id)) return false;
    const res = await this.model.findByIdAndDelete(id).exec();
    return !!res;
  }

  protected async deleteMany(filter: FilterQuery<TDoc>): Promise<number> {
    const res = await this.model.deleteMany(filter).exec();
    return res.deletedCount ?? 0;
  }
}
