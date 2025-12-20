import escapeStringRegexp from 'escape-string-regexp';
import { FilterQuery } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DateUtil } from 'src/common/utils';
import { pickSortableFields } from 'src/modules/base/helpers';
import { MovieRepository } from 'src/modules/movies/repositories';
import { MovieDocument } from 'src/modules/movies/schemas';
import { MovieInputTypes as InputTypes } from './movie.service.type';
import { MovieQueryFields as QUERY_FIELDS } from './movie.service.constant';

@Injectable()
export class MovieService {
  constructor(private readonly movieRepo: MovieRepository) {}

  public async findMovieById(id: string) {
    return this.movieRepo.query.findOneById({ id });
  }

  /** */
  private async findMoviesByQuery(
    options: InputTypes.PaginatedQuery & InputTypes.ReleaseWindow,
  ) {
    const { search, page, limit, sort, releaseDate, endDate, ...rest } =
      options;
    const filter: FilterQuery<MovieDocument> = {};

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

    // array fields
    QUERY_FIELDS.ARRAY_MATCH.forEach((f) => {
      if (rest[f]?.length) filter[f] = { $in: rest[f] };
    });

    // exact match fields
    QUERY_FIELDS.EXACT_MATCH.forEach((f) => {
      if (rest[f] !== undefined) filter[f] = rest[f];
    });

    // time window
    if (releaseDate?.$gte || releaseDate?.$lte)
      filter.releaseDate = releaseDate;

    if (endDate?.$gte || endDate?.$lte) {
      filter.$and ??= [];
      filter.$and.push({
        $or: [{ endDate }, { endDate: { $exists: false } }],
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

    return {
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  public async findMoviesPaginated(
    options: InputTypes.PaginatedDateRangeQuery,
  ) {
    const { startDate: rawStart, endDate: rawEnd, ...rest } = options;

    let startDate: Date | undefined;
    if (rawStart) startDate = DateUtil.startOfDay(rawStart);

    let endDate: Date | undefined;
    if (rawEnd) endDate = DateUtil.endOfDay(rawEnd);

    if (startDate && endDate && startDate > endDate) {
      throw new ConflictException(
        'Start date must be before or equal to end date',
      );
    }

    const releaseWindow: InputTypes.ReleaseWindow = {};
    if (endDate) releaseWindow.releaseDate = { $lte: endDate };
    if (startDate) releaseWindow.endDate = { $gte: startDate };

    return this.findMoviesByQuery({
      ...rest,
      ...releaseWindow,
    });
  }

  public async findShowingMoviesPaginated(options: InputTypes.PaginatedQuery) {
    const now = DateUtil.now();
    const today = DateUtil.startOfDay(now);

    return this.findMoviesByQuery({
      ...options,
      releaseDate: { $lte: today },
      endDate: { $gte: today },
    });
  }

  public async findUpcomingMoviesPaginated(options: InputTypes.PaginatedQuery) {
    const now = DateUtil.now();
    const tomorrow = DateUtil.startOfDay(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.findMoviesByQuery({
      ...options,
      releaseDate: { $gte: tomorrow },
    });
  }

  /** */
  public async createMovie(data: InputTypes.Create) {
    const { releaseDate: rawRelease, endDate: rawEnd, ...rest } = data;
    if (rawEnd && rawRelease > rawEnd)
      throw new ConflictException(
        'Start date must be before or equal to end date',
      );

    const releaseDate = DateUtil.startOfDay(rawRelease);
    const endDate = rawEnd ? DateUtil.endOfDay(rawEnd) : undefined;

    const { insertedItem: createdMovie } =
      await this.movieRepo.command.createOne({
        data: {
          ...rest,
          releaseDate,
          endDate,
        },
      });

    if (!createdMovie) throw new BadRequestException('Creation failed');
    return createdMovie;
  }

  public async updateMovieById(id: string, update: InputTypes.Update) {
    const existed = await this.movieRepo.query.findOneById({ id });
    if (!existed) throw new NotFoundException('Movie not found');

    const { releaseDate: rawRelease, endDate: rawEnd, ...rest } = update;

    const nextRelease = rawRelease
      ? DateUtil.startOfDay(rawRelease)
      : existed.releaseDate;
    const nextEnd = rawEnd ? DateUtil.endOfDay(rawEnd) : existed.endDate;

    if (nextEnd && nextRelease > nextEnd)
      throw new ConflictException(
        'Start date must be before or equal to end date',
      );

    const { modifiedItem: updatedMovie } =
      await this.movieRepo.command.updateOneById({
        id,
        update: {
          ...rest,
          ...(rawRelease && { releaseDate: nextRelease }),
          ...(rawEnd && { endDate: nextEnd }),
        },
      });

    if (!updatedMovie)
      throw new InternalServerErrorException('Update failed unexpectedly');
    return updatedMovie;
  }

  public async deleteMovieById(id: string) {
    const exists = await this.movieRepo.query.exists({ filter: { _id: id } });
    if (!exists) throw new NotFoundException('Movie not found');

    const result = await this.movieRepo.command.deleteOneById({ id });
    if (!result.deletedCount)
      throw new InternalServerErrorException('Deletion failed unexpectedly');

    // TODO: deactivate all showtime
  }
}
