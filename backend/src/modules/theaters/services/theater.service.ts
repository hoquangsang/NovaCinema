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
import { TheaterDocument } from '../schemas/theater.schema';
import { RoomService } from './room.service';
import { TheaterCriteria as Criteria } from './theater.service.type';

const QUERY_FIELDS = {
  SEARCHABLE: ['theaterName', 'address'] as const,
  REGEX_MATCH: ['theaterName', 'address', 'hotline'] as const,
  ARRAY_MATCH: [] as const,
  EXACT_MATCH: ['isActive'] as const,
  SORTABLE: ['theaterName', 'address', 'hotline'] as const,
} as const;

@Injectable()
export class TheaterService {
  constructor(
    private readonly theaterRepo: TheaterRepository,
    private readonly roomService: RoomService,
  ) {}

  /** */
  public async findTheaterById(id: string) {
    const existingTheater = await this.theaterRepo.query.findOneById({ id });
    if (!existingTheater) return null;

    const roomsCount = await this.roomService.countRoomsByTheaterId(id);
    return {
      ...existingTheater,
      roomsCount,
    };
  }

  /** */
  public async findTheaters(options: Criteria.Query) {
    const { sort: rawSort, ...rest } = options;
    const filter = this.buildQueryFilter(rest);
    const sort = pickSortableFields(rawSort, QUERY_FIELDS.SORTABLE);

    const theaters = await this.theaterRepo.query.findMany({
      filter,
      sort,
    });

    return await Promise.all(
      theaters.map(async (theater) => {
        const roomsCount = await this.roomService.countRoomsByTheaterId(
          theater._id,
        );
        return {
          ...theater,
          roomsCount,
        };
      }),
    );
  }

  /** */
  public async findTheatersPaginated(options: Criteria.PaginatedQuery) {
    const { page, limit, sort: rawSort, ...rest } = options;
    const filter = this.buildQueryFilter(rest);
    const sort = pickSortableFields(rawSort, QUERY_FIELDS.SORTABLE);

    //
    const result = await this.theaterRepo.query.findManyPaginated({
      filter,
      page,
      limit,
      sort,
    });

    const theaters = await Promise.all(
      result.items.map(async (theater) => {
        const roomsCount = await this.roomService.countRoomsByTheaterId(
          theater._id,
        );
        return {
          ...theater,
          roomsCount,
        };
      }),
    );
    return {
      items: theaters,
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
    const { insertedItem: createdTheater } =
      await this.theaterRepo.command.createOne({ data });

    if (!createdTheater) throw new BadRequestException('Creation failed');
    return createdTheater;
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
    const { modifiedItem: updatedTheater } =
      await this.theaterRepo.command.updateOneById({
        id,
        update,
      });

    if (!updatedTheater) throw new NotFoundException('Theater not found');
    return updatedTheater;
  }

  /** */
  public async deleteTheaterById(id: string) {
    //TODO: add transaction
    const existing = await this.theaterRepo.query.findOneById({
      id,
      inclusion: { _id: true },
    });
    if (!existing) throw new NotFoundException('Theater not found');

    // delete all rooms
    await this.roomService.deleteRoomsByTheaterId(existing._id);

    const result = await this.theaterRepo.command.deleteOneById({ id });
    if (!result.deletedCount)
      throw new InternalServerErrorException('Deletion failed');

    // TODO: deactivate all showtimes
    return true;
  }

  /** */
  private buildQueryFilter(options: Criteria.Query) {
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

    return filter;
  }
}
