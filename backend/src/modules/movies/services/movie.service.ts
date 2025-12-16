import escapeStringRegexp from 'escape-string-regexp';
import { FilterQuery } from 'mongoose';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { pickSortableFields } from 'src/modules/base/helpers';
import { MovieRepository } from '../repositories/movie.repository';
import { MovieDocument } from '../schemas/movie.schema';
import { MovieInputTypes as InputTypes } from './movie.service.type';
import { MovieQueryFields as QUERY_FIELDS } from './movie.service.constant';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepo: MovieRepository
  ) {}

  public async findMovieById(id: string) {
    return this.movieRepo.query.findOneById({ id });
  }

  /** */
  private async findMoviesByQuery(options: InputTypes.PaginatedQuery & InputTypes.ReleaseWindow) {
    const { search, page, limit, sort, releaseDate, endDate, ...rest } = options;
    const filter: FilterQuery<MovieDocument> = {};
    
    // search fields
    if (search) {
      const r = new RegExp(escapeStringRegexp(search), 'i');
      filter.$or = QUERY_FIELDS.SEARCHABLE.map(f => ({ [f]: r }));
    } 

    // regex fields
    QUERY_FIELDS.REGEX_MATCH.forEach(f => {
      if (rest[f] !== undefined) filter[f] = new RegExp(escapeStringRegexp(rest[f]), 'i');
    });

    // array fields
    QUERY_FIELDS.ARRAY_MATCH.forEach(f => {
      if (rest[f]?.length) filter[f] = { $in: rest[f] };
    });

    // exact match fields
    QUERY_FIELDS.EXACT_MATCH.forEach(f => {
      if (rest[f] !== undefined) filter[f] = rest[f];
    });

    // time window
    if (releaseDate?.$gte || releaseDate?.$lte)
      filter.releaseDate = releaseDate;
    
    if (endDate?.$gte || endDate?.$lte) {
      filter.$and ??= [];
      filter.$and.push({
        $or: [
          { endDate },
          { endDate: { $exists: false } }
        ]
      });
    }
    
    // safe sort
    const safeSort = pickSortableFields(sort, QUERY_FIELDS.SORTABLE);

    //
    const result = await this.movieRepo.query.findManyPaginated({
      filter,
      page,
      limit,
      sort: safeSort,
    });
    result.items.forEach((i) => { console.log(`${i.releaseDate} -> ${i.endDate}`)});
    console.log('-------------')
    console.log(filter);
    console.log('-------------')
    return {
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  public async findMoviesPaginated(options: InputTypes.PaginatedRangeQuery) {
    const { start, end, ...rest } = options;
    if (start && end && start > end)
      throw new ConflictException('Start date must be before or equal to end date')

    const releaseWindow: InputTypes.ReleaseWindow = {};
    if (end) releaseWindow.releaseDate = { $lte: end };
    if (start) releaseWindow.endDate = { $gte: start };
    return this.findMoviesByQuery({
      ...rest,
      ...releaseWindow
    });
  }

  public async findShowingMoviesPaginated(options: InputTypes.PaginatedQuery) {
    const now = new Date();

    return this.findMoviesByQuery({
      ...options,
      releaseDate: { $lte: now },
      endDate: { $gte: now }
    });
  }

  public async findUpcomingMoviesPaginated(options: InputTypes.PaginatedQuery) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return this.findMoviesByQuery({
      ...options,
      releaseDate: { $gte: tomorrow }
    });
  }

  /** */
  public async createMovie(data: InputTypes.Create) {
    const { releaseDate: rawRelease, endDate: rawEnd, ...rest } = data;    
    if (rawEnd && rawRelease > rawEnd)
      throw new ConflictException('Start date must be before or equal to end date')

    const releaseDate = new Date(rawRelease);
    releaseDate.setHours(0, 0, 0, 0);

    const endDate = rawEnd ? new Date(rawEnd) : undefined;
    if (endDate)
      endDate.setHours(23, 59, 59, 999);

    const result = await this.movieRepo.command.createOne({
      data: {
        ...rest,
        releaseDate,
        endDate
      }
    });
    
    if (!result.insertedItem)
      throw new BadRequestException('Creation failed');
    return result.insertedItem;
  }

  public async updateMovieById(id: string, update: InputTypes.Update) {
    const existed = await this.movieRepo.query.findOneById({ id });
    if (!existed)
      throw new NotFoundException('Movie not found');

    const { releaseDate: rawRelease, endDate: rawEnd, ...rest } = update;    
    const nextRelease = rawRelease ? new Date(rawRelease) : existed.releaseDate;
    const nextEnd = rawEnd ? new Date(rawEnd) : existed.endDate;
    
    if (nextRelease) nextRelease.setHours(0, 0, 0, 0);
    if (nextEnd) nextEnd.setHours(23, 59, 59, 999);

    if (nextEnd && nextRelease > nextEnd)
      throw new ConflictException('Start date must be before or equal to end date')

    const result = await this.movieRepo.command.updateOneById({
      id, update : {
        ...rest,
        ...(rawRelease && { releaseDate: nextRelease }),
        ...(rawEnd && { endDate: nextEnd }),
      }
    });

    if (!result.matchedCount || !result.modifiedCount)
      throw new BadRequestException('Update failed');
    return result.modifiedItem;
  }

  public async deleteMovieById(id: string) {
    const exists = await this.movieRepo.query.exists({ filter: { _id: id } });
    if (!exists)
      throw new NotFoundException('Movie not found');

    const result = await this.movieRepo.command.deleteOneById({ id });
    if (!result.deletedCount)
      throw new InternalServerErrorException('Deletion failed');
    
    // TODO: deactivate all showtime
  }
}
