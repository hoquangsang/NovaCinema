import escapeStringRegexp from 'escape-string-regexp';
import { FilterQuery } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { pickSortableFields } from 'src/modules/base/helpers';
import { TheaterRepository } from '../repositories/theater.repository';
import { RoomRepository } from '../repositories/room.repository';
import { TheaterDocument } from '../schemas/theater.schema';
import { TheaterInputTypes as InputTypes } from './theater.service.type';
import { TheaterQueryFields as QUERY_FIELDS } from './theater.service.constant';

@Injectable()
export class TheaterService {
  constructor(
    private readonly theaterRepo: TheaterRepository,
    private readonly roomRepo: RoomRepository,
  ) {}

  /** */
  public async findTheaterById(id: string) {
    return this.theaterRepo.query.findOneById({ id });
  }

  /** */
  public async findTheaters(options: InputTypes.Query) {
    const { search, sort: rawSort, ...rest } = options;
    const filter: FilterQuery<TheaterDocument> = {};

    // search fields
    if (search) {
      const r = new RegExp(escapeStringRegexp(search), 'i');
      filter.$or = QUERY_FIELDS.SEARCHABLE.map((f) => ({ [f]: r }));
    }

    // regex fields
    QUERY_FIELDS.REGEX_MATCH.forEach((f) => {
      if (rest[f] !== undefined)
        filter[f] = new RegExp(escapeStringRegexp(rest[f]), 'i');
    });

    // exact match fields
    QUERY_FIELDS.EXACT_MATCH.forEach((f) => {
      if (rest[f] !== undefined) filter[f] = rest[f];
    });

    // safe sort
    const sort = pickSortableFields(rawSort, QUERY_FIELDS.SORTABLE);

    //
    return this.theaterRepo.query.findMany({
      filter,
      sort,
    });
  }

  /** */
  public async findTheatersPaginated(options: InputTypes.PaginatedQuery) {
    const { search, page, limit, sort: rawSort, ...rest } = options;
    const filter: FilterQuery<TheaterDocument> = {};

    // search fields
    if (search) {
      const r = new RegExp(escapeStringRegexp(search), 'i');
      filter.$or = QUERY_FIELDS.SEARCHABLE.map((f) => ({ [f]: r }));
    }

    // regex fields
    QUERY_FIELDS.REGEX_MATCH.forEach((f) => {
      if (rest[f] !== undefined)
        filter[f] = new RegExp(escapeStringRegexp(rest[f]), 'i');
    });

    // exact match fields
    QUERY_FIELDS.EXACT_MATCH.forEach((f) => {
      if (rest[f] !== undefined) filter[f] = rest[f];
    });

    // safe sort
    const sort = pickSortableFields(rawSort, QUERY_FIELDS.SORTABLE);

    //
    const result = await this.theaterRepo.query.findManyPaginated({
      filter,
      page,
      limit,
      sort,
    });

    return {
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  /** */
  public async createTheater(data: {
    theaterName: string;
    address?: string;
    hotline?: string;
  }) {
    const result = await this.theaterRepo.command.createOne({ data });

    if (!result.insertedCount) throw new BadRequestException('Creation failed');
    return result.insertedItem;
  }

  /** */
  public async updateTheaterById(
    id: string,
    update: {
      theaterName?: string;
      address?: string;
      hotline?: string;
    },
  ) {
    const result = await this.theaterRepo.command.updateOneById({
      id,
      update,
    });

    if (!result.matchedCount) throw new NotFoundException('Theater not found');
    return result.modifiedItem;
  }

  /** */
  public async deleteTheaterById(id: string): Promise<void> {
    //TODO: add transaction
    const theater = await this.theaterRepo.query.findOneById({
      id,
      inclusion: { _id: true },
    });
    if (!theater) throw new NotFoundException('Theater not found');

    // delete rooms
    await this.roomRepo.command.deleteMany({
      filter: {
        theaterId: theater._id,
      },
    });

    const result = await this.theaterRepo.command.deleteOneById({ id });
    if (!result.deletedCount)
      throw new InternalServerErrorException('Deletion failed');

    // TODO: deactivate all showtime
  }
}
