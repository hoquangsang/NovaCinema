import {
  ClientSession,
  FilterQuery,
  Model,
  Types,
  PipelineStage,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  QueryRepository,
  PaginationResult,
} from 'src/modules/base/repositories/query';
import { RoomType } from 'src/modules/theaters/types';
import { Showtime, ShowtimeDocument } from '../schemas/showtime.schema';
import { mapObjectIdsToStrings } from 'src/modules/base/mappers';

// Type for light showtime result (list APIs)
export interface LightShowtime {
  _id: string;
  movieId: string;
  roomId: string;
  theaterId: string;
  roomType: RoomType;
  startAt: Date;
  endAt: Date;
  isActive?: boolean;
  // Flat name fields
  movieTitle?: string;
  moviePosterUrl?: string;
  roomName?: string;
  theaterName?: string;
}

// Type for populated showtime result (detail API)
export interface PopulatedShowtime {
  _id: string;
  movieId: string;
  roomId: string;
  theaterId: string;
  roomType: RoomType;
  startAt: Date;
  endAt: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  movie?: {
    _id: string;
    title: string;
    posterUrl?: string;
    duration: number;
    genres: string[];
    ratingAge?: string;
  };
  room?: {
    _id: string;
    roomName: string;
    roomType: RoomType;
    capacity?: number;
  };
  theater?: {
    _id: string;
    theaterName: string;
    address?: string;
  };
}

@Injectable()
export class ShowtimeQueryRepository extends QueryRepository<
  Showtime,
  ShowtimeDocument
> {
  public constructor(
    @InjectModel(Showtime.name)
    private readonly showtimeModel: Model<ShowtimeDocument>,
  ) {
    super(showtimeModel);
  }

  /**
   * Build LIGHT aggregation pipeline for list APIs
   * Only fetches names (movieTitle, roomName, theaterName)
   */
  private buildLightPipeline(
    filter: FilterQuery<ShowtimeDocument> = {},
    options: {
      sort?: Record<string, 1 | -1>;
      skip?: number;
      limit?: number;
    } = {},
  ): PipelineStage[] {
    const pipeline: PipelineStage[] = [];

    pipeline.push({ $match: filter });

    if (options.sort) {
      pipeline.push({ $sort: options.sort });
    }
    if (options.skip !== undefined) {
      pipeline.push({ $skip: options.skip });
    }
    if (options.limit !== undefined) {
      pipeline.push({ $limit: options.limit });
    }

    // Lookup movie - only title and posterUrl
    pipeline.push({
      $lookup: {
        from: 'movies',
        localField: 'movieId',
        foreignField: '_id',
        as: 'movieData',
        pipeline: [{ $project: { title: 1, posterUrl: 1 } }],
      },
    });

    // Lookup room - only name
    pipeline.push({
      $lookup: {
        from: 'rooms',
        localField: 'roomId',
        foreignField: '_id',
        as: 'roomData',
        pipeline: [{ $project: { roomName: 1 } }],
      },
    });

    // Lookup theater - only name
    pipeline.push({
      $lookup: {
        from: 'theaters',
        localField: 'theaterId',
        foreignField: '_id',
        as: 'theaterData',
        pipeline: [{ $project: { theaterName: 1 } }],
      },
    });

    // Extract flat fields
    pipeline.push({
      $addFields: {
        movieTitle: { $arrayElemAt: ['$movieData.title', 0] },
        moviePosterUrl: { $arrayElemAt: ['$movieData.posterUrl', 0] },
        roomName: { $arrayElemAt: ['$roomData.roomName', 0] },
        theaterName: { $arrayElemAt: ['$theaterData.theaterName', 0] },
      },
    });

    // Remove temporary arrays
    pipeline.push({
      $project: {
        movieData: 0,
        roomData: 0,
        theaterData: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    });

    return pipeline;
  }

  /**
   * Build FULL aggregation pipeline for detail API
   * Fetches complete nested objects
   */
  private buildFullPipeline(
    filter: FilterQuery<ShowtimeDocument> = {},
  ): PipelineStage[] {
    const pipeline: PipelineStage[] = [];

    pipeline.push({ $match: filter });

    // Lookup movie - full details
    pipeline.push({
      $lookup: {
        from: 'movies',
        localField: 'movieId',
        foreignField: '_id',
        as: 'movieData',
        pipeline: [
          {
            $project: {
              _id: 1,
              title: 1,
              posterUrl: 1,
              duration: 1,
              genres: 1,
              ratingAge: 1,
            },
          },
        ],
      },
    });

    // Lookup room - full details with capacity calculation
    pipeline.push({
      $lookup: {
        from: 'rooms',
        localField: 'roomId',
        foreignField: '_id',
        as: 'roomData',
        pipeline: [
          { $project: { _id: 1, roomName: 1, roomType: 1, seatMap: 1 } },
        ],
      },
    });

    // Lookup theater - full details
    pipeline.push({
      $lookup: {
        from: 'theaters',
        localField: 'theaterId',
        foreignField: '_id',
        as: 'theaterData',
        pipeline: [{ $project: { _id: 1, theaterName: 1, address: 1 } }],
      },
    });

    // Unwind and reshape
    pipeline.push({
      $addFields: {
        movie: { $arrayElemAt: ['$movieData', 0] },
        roomRaw: { $arrayElemAt: ['$roomData', 0] },
        theater: { $arrayElemAt: ['$theaterData', 0] },
      },
    });

    // Calculate room capacity from seatMap
    pipeline.push({
      $addFields: {
        room: {
          _id: '$roomRaw._id',
          roomName: '$roomRaw.roomName',
          roomType: '$roomRaw.roomType',
          capacity: {
            $reduce: {
              input: { $ifNull: ['$roomRaw.seatMap', []] },
              initialValue: 0,
              in: { $add: ['$$value', { $size: '$$this' }] },
            },
          },
        },
      },
    });

    // Remove temporary fields
    pipeline.push({
      $project: {
        movieData: 0,
        roomData: 0,
        theaterData: 0,
        roomRaw: 0,
      },
    });

    return pipeline;
  }

  /**
   * Find one showtime by ID with FULL populated data (for detail API)
   */
  public async findOneByIdPopulated(
    id: string,
    session?: ClientSession,
  ): Promise<PopulatedShowtime | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const pipeline = this.buildFullPipeline({ _id: new Types.ObjectId(id) });

    const results = await this.showtimeModel
      .aggregate(pipeline)
      .session(session ?? null)
      .exec();

    if (!results.length) return null;
    return mapObjectIdsToStrings(results[0]) as PopulatedShowtime;
  }

  /**
   * Find many showtimes with LIGHT populated data (for list APIs)
   */
  public async findManyLight(options: {
    filter?: FilterQuery<ShowtimeDocument>;
    sort?: Record<string, 1 | -1>;
    session?: ClientSession;
  }): Promise<LightShowtime[]> {
    const { filter = {}, sort = { startAt: 1 }, session } = options;

    const pipeline = this.buildLightPipeline(filter, { sort });

    const results = await this.showtimeModel
      .aggregate(pipeline)
      .session(session ?? null)
      .exec();

    return mapObjectIdsToStrings(results) as LightShowtime[];
  }

  /**
   * Find many showtimes with pagination and LIGHT populated data (for list APIs)
   */
  public async findManyPaginatedLight(options: {
    filter?: FilterQuery<ShowtimeDocument>;
    sort?: Record<string, 1 | -1>;
    page?: number;
    limit?: number;
    session?: ClientSession;
  }): Promise<PaginationResult<LightShowtime>> {
    const {
      filter = {},
      sort = { startAt: 1 },
      page = 1,
      limit = 10,
      session,
    } = options;

    const skip = Math.max((page - 1) * limit, 0);

    const [results, total] = await Promise.all([
      this.showtimeModel
        .aggregate(this.buildLightPipeline(filter, { sort, skip, limit }))
        .session(session ?? null)
        .exec(),
      this.count({ filter, session }),
    ]);

    const items = mapObjectIdsToStrings(results) as LightShowtime[];
    return { items, total, page, limit };
  }
}
