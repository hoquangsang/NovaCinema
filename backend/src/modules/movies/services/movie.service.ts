import escapeStringRegexp from 'escape-string-regexp';
import { FilterQuery } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SortFields } from 'src/common/types';
import { DateUtil } from 'src/common/utils';
import { pickSortableFields } from 'src/common/helpers';
import { MovieRepository } from 'src/modules/movies/repositories';
import { MovieDocument } from 'src/modules/movies/schemas';

const QUERY_FIELDS = {
  SEARCHABLE: ['title', 'director', 'producer', 'genres', 'actors'],
  REGEX_MATCH: ['title', 'director', 'producer'],
  ARRAY_MATCH: ['genres', 'actors'],
  EXACT_MATCH: ['ratingAge', 'country', 'language'],
  SORTABLE: [
    'title',
    'duration',
    'releaseDate',
    'endDate',
    'ratingAge',
    'country',
    'language',
  ],
} as const;

type FilterCriteria = {
  title?: string;
  director?: string;
  producer?: string;
  genres?: string[];
  actors?: string[];
  ratingAge?: string;
  country?: string;
  language?: string;
};

type ReleaseWindowCriteria = {
  releaseDate?: { $gte?: Date; $lte?: Date };
  endDate?: { $gte?: Date; $lte?: Date };
};

type QueryCriteria = FilterCriteria & {
  search?: string;
  sort?: SortFields;
};
type PaginatedQueryCriteria = QueryCriteria & {
  page?: number;
  limit?: number;
};

type PaginatedQueryRangeCriteria = PaginatedQueryCriteria & {
  from?: Date;
  to?: Date;
};

type CreateCriteria = {
  title: string;
  genres: string[];
  duration: number;
  description?: string;
  posterUrl?: string;
  trailerUrl?: string;
  releaseDate: Date;
  endDate?: Date;
  ratingAge?: string;
  country?: string;
  language?: string;
  actors?: string[];
  director?: string;
  producer?: string;
};

type UpdateCriteria = Partial<CreateCriteria>;

@Injectable()
export class MovieService {
  constructor(private readonly movieRepo: MovieRepository) {}

  public async findMovieById(id: string) {
    return this.movieRepo.query.findOneById({ id });
  }

  /** */
  private async findMoviesByQuery(
    options: PaginatedQueryCriteria & ReleaseWindowCriteria,
  ) {
    const {
      search,
      page,
      limit,
      sort: rawSort,
      releaseDate,
      endDate,
      ...rest
    } = options;
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
    const sort = pickSortableFields(rawSort, QUERY_FIELDS.SORTABLE);

    //
    const result = await this.movieRepo.query.findManyPaginated({
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

  public async findMoviesPaginated(options: PaginatedQueryRangeCriteria) {
    const { from: rawStart, to: rawEnd, ...rest } = options;

    const startDate = rawStart ? DateUtil.startOfDay(rawStart) : undefined;
    const endDate = rawEnd ? DateUtil.endOfDay(rawEnd) : undefined;
    if (startDate && endDate && startDate > endDate) {
      throw new ConflictException(
        'Start date must be before or equal to end date',
      );
    }

    const releaseWindow: ReleaseWindowCriteria = {};
    if (endDate) releaseWindow.releaseDate = { $lte: endDate };
    if (startDate) releaseWindow.endDate = { $gte: startDate };

    return this.findMoviesByQuery({
      ...rest,
      ...releaseWindow,
    });
  }

  public async findShowingMoviesPaginated(options: PaginatedQueryCriteria) {
    const today = DateUtil.startOfDay(DateUtil.now());

    return this.findMoviesByQuery({
      ...options,
      releaseDate: { $lte: today },
      endDate: { $gte: today },
    });
  }

  public async findUpcomingMoviesPaginated(options: PaginatedQueryCriteria) {
    const tomorrowStart = DateUtil.startOfDay(
      DateUtil.add(DateUtil.now(), { days: 1 }),
    );

    return this.findMoviesByQuery({
      ...options,
      releaseDate: { $gte: tomorrowStart },
    });
  }

  /** */
  public async createMovie(data: CreateCriteria) {
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

  public async updateMovieById(id: string, update: UpdateCriteria) {
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
    return true;
  }
}
