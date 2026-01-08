import escapeStringRegexp from 'escape-string-regexp';
import { FilterQuery, Types } from 'mongoose';
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
import { MovieService } from 'src/modules/movies';
import { RoomService, TheaterService } from 'src/modules/theaters';
import { RoomType } from 'src/modules/theaters/types';
import { ShowtimeDocument } from '../schemas';
import { ShowtimeRepository } from '../repositories/showtime.repository';

const GAP_MIN = 10;
const ROUND_STEP_MIN = 5;
const QUERY_FIELDS = {
  SEARCHABLE: [] as readonly string[],
  REGEX_MATCH: [] as readonly string[],
  ARRAY_MATCH: [] as readonly string[],
  EXACT_MATCH: ['isActive', 'movieId', 'theaterId', 'roomId'],
  SORTABLE: ['startAt'],
} as const;

interface MovieLike {
  _id: string;
  duration: number;
  releaseDate: Date;
  endDate?: Date;
}

interface RoomLike {
  _id: string;
  theaterId: string;
  roomName: string;
  roomType: RoomType;
}

interface ShowtimeLike {
  _id: string;
  movieId: string;
  theaterId: string;
  roomId: string;
  roomType: RoomType;
  startAt: Date;
  endAt: Date;
  isActive?: Boolean;
}

type ShowtimeRange = {
  movieId: string;
  roomId: string;
  theaterId: string;
  roomType: RoomType;
  startAt: Date;
  endAt: Date;
};

type FilterCriteria = {
  movieId?: string;
  theaterId?: string;
  roomId?: string;
  isActive?: boolean;
};

type QueryCriteria = FilterCriteria & {
  search?: string;
  sort?: SortFields;
};

type QueryRangeCriteria = QueryCriteria & {
  from?: Date;
  to?: Date;
};

type QueryByDateCriteria = QueryCriteria & {
  date: Date;
};

type QueryAvailableCriteria = QueryCriteria & {
  date?: Date;
  movieId: string;
};

type PaginatedQueryCriteria = QueryCriteria & {
  page?: number;
  limit?: number;
};

type PaginatedQueryRangeCriteria = PaginatedQueryCriteria & {
  from?: Date;
  to?: Date;
};

/** */
type CreateCriteria = {
  movieId: string;
  roomId: string;
  startAt: Date;
};

type RoomScheduleCriteria = {
  roomId: string;
  startAts: Date[];
};

type CreateBulkCriteria = {
  movieId: string;
  schedules: RoomScheduleCriteria[];
};

/** */
type UpdateCriteria = {
  movieId: string;
  roomId: string;
  startAt: Date;
};

/** */
type DeleteBulkCriteria = {
  ids: string[];
};

@Injectable()
export class ShowtimeService {
  public constructor(
    private readonly showtimeRepo: ShowtimeRepository,
    private readonly roomService: RoomService,
    private readonly theaterService: TheaterService,
    private readonly movieService: MovieService,
  ) {}

  /******************************** */
  public async findShowtimeById(id: string) {
    return this.showtimeRepo.query.findOneById({ id });
  }

  public async findShowtimeDetailById(id: string) {
    const showtime = await this.findShowtimeById(id);
    if (!showtime) return null;
    const { movieId, theaterId, roomId, roomType: _, ...rest } = showtime;

    const existingtheater =
      await this.theaterService.findTheaterById(theaterId);
    if (!existingtheater) throw new Error('Theater not found');
    const { ...theater } = existingtheater;

    const existingroom = await this.roomService.findRoomById(roomId);
    if (!existingroom) throw new Error('Room not found');
    const { seatMap, ...room } = existingroom;

    const existingmovie = await this.movieService.findMovieById(movieId);
    if (!existingmovie) throw new Error('Movie not found');
    const { ...movie } = existingmovie;

    return {
      ...rest,
      movie,
      theater,
      room,
    };
  }

  public async findShowtimes(options: QueryRangeCriteria) {
    const { sort: rawSort = { startAt: 'asc' }, ...rest } = options;
    const filter = this.buildShowtimeFilter(rest);
    const sort = pickSortableFields(rawSort, QUERY_FIELDS.SORTABLE);

    return this.showtimeRepo.query.findMany({
      filter: filter,
      sort: sort,
    });
  }

  public async findAvailableShowtimes(options: QueryAvailableCriteria) {
    const now = DateUtil.now();
    const { date = now, ...rest } = options;

    const startDay = DateUtil.startOfDay(date);
    const endDay = DateUtil.endOfDay(date);

    if (endDay < now) {
      return [];
    }

    return this.findShowtimes({
      ...rest,
      from: DateUtil.max(now, startDay),
      to: endDay,
    });
  }

  public async findShowtimesPaginated(options: PaginatedQueryRangeCriteria) {
    const {
      page,
      limit,
      sort: rawSort = { startAt: 'asc' },
      ...rest
    } = options;
    const filter = this.buildShowtimeFilter(rest);
    const sort = pickSortableFields(rawSort, QUERY_FIELDS.SORTABLE);

    const result = await this.showtimeRepo.query.findManyPaginated({
      filter: filter,
      page: page,
      limit: limit,
      sort: sort,
    });

    return {
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  /******************************** */
  public async createSingleShowtime(data: CreateCriteria) {
    const { movieId, roomId, startAt } = data;
    const schedule = {
      roomId: roomId,
      startAts: [startAt],
    };

    const showtimes = await this.createBulkShowtimes({
      movieId,
      schedules: [schedule],
    });

    if (!showtimes.length) {
      throw new BadRequestException('Creation failed');
    }
    return showtimes[0];
  }

  public async createBulkShowtimes(data: CreateBulkCriteria) {
    const { movieId, schedules } = data;
    const movie = await this.getValidatedMovie(movieId);
    const rooms = await this.getValidatedRooms(schedules);
    const showtimes = this.buildShowtimeSchedules(movie, rooms, schedules);
    await this.assertShowtimeAvailability(showtimes, rooms);

    // TODO: add transaction
    try {
      const { insertedCount, insertedItems } =
        await this.showtimeRepo.command.createMany({
          data: showtimes,
        });

      if (insertedCount !== showtimes.length) {
        throw new InternalServerErrorException('Failed to create showtimes');
      }

      return insertedItems;
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Duplicate showtime');
      }
      throw err;
    }
  }

  /******************************** */
  public async deleteShowtimeById(id: string) {
    const exists = await this.showtimeRepo.query.exists({
      filter: { _id: id },
    });
    if (!exists) throw new NotFoundException('Showtime not found');

    const result = await this.showtimeRepo.command.deleteOneById({ id });
    if (!result.deletedCount)
      throw new InternalServerErrorException('Deletion failed');
    return true;
  }

  public async deleteShowtimes(options: DeleteBulkCriteria) {
    const { ids } = options;

    const existing = await this.showtimeRepo.query.findMany({
      filter: {
        _id: { $in: ids },
      },
      inclusion: { _id: true },
    });
    const foundIds = new Set(existing.map((s) => s._id));
    const missing = ids.filter((id) => !foundIds.has(id));
    if (missing.length) {
      throw new BadRequestException(
        `Showtimes not found: ${missing.join(', ')}`,
      );
    }

    const { deletedCount } = await this.showtimeRepo.command.deleteMany({
      filter: {
        _id: { $in: ids },
      },
    });
    if (deletedCount !== ids.length) {
      // optional: log warning / reject
    }
    return { deleteCount: deletedCount };
  }

  /******************************** */
  private buildShowtimeFilter(options: QueryRangeCriteria) {
    const { search, from: startAt, to: endAt, ...rest } = options;

    const filter: FilterQuery<ShowtimeDocument> = {};

    // search fields
    if (search && QUERY_FIELDS.SEARCHABLE.length) {
      const r = new RegExp(escapeStringRegexp(search), 'i');
      filter.$or = QUERY_FIELDS.SEARCHABLE.map((f) => ({ [f]: r }));
    }

    // regex fields
    QUERY_FIELDS.REGEX_MATCH.forEach((f) => {
      if (rest[f] !== undefined) {
        filter[f] = new RegExp(escapeStringRegexp(rest[f]), 'i');
      }
    });

    // array fields
    QUERY_FIELDS.ARRAY_MATCH.forEach((f) => {
      if (rest[f]?.length) {
        filter[f] = { $in: rest[f] };
      }
    });

    // exact match fields
    QUERY_FIELDS.EXACT_MATCH.forEach((f) => {
      if (rest[f] !== undefined) {
        filter[f] = rest[f];
      }
    });

    // datetime window
    if (startAt || endAt) {
      filter.startAt = {
        ...(startAt && { $gte: startAt }),
        ...(endAt && { $lte: endAt }),
      };
    }

    return filter;
  }

  /******************************** */
  private async getValidatedMovie(movieId: string): Promise<MovieLike> {
    if (!movieId) {
      throw new BadRequestException('Movie is required');
    }

    const movie = await this.movieService.findMovieById(movieId);

    if (!movie) {
      throw new BadRequestException('Movie not found');
    }

    if (movie.duration <= 0) {
      throw new BadRequestException('Invalid movie duration');
    }

    if (!movie.releaseDate) {
      throw new BadRequestException('Movie release date is required');
    }

    return movie;
  }

  private async getValidatedRooms(
    schedules: RoomScheduleCriteria[],
  ): Promise<RoomLike[]> {
    if (!Array.isArray(schedules) || !schedules?.length) {
      throw new BadRequestException('Room schedules are required');
    }

    const roomIds: string[] = [];
    const seenRooms = new Set<string>();
    schedules.forEach((schedule, i) => {
      const { roomId, startAts } = schedule;
      if (!roomId) {
        throw new BadRequestException(`schedules[${i}].roomId is required`);
      }

      if (seenRooms.has(roomId)) {
        throw new BadRequestException(
          `Duplicate room in schedules[${i}]: ${roomId}`,
        );
      }
      seenRooms.add(roomId);

      if (!Array.isArray(schedule.startAts) || !startAts?.length) {
        throw new BadRequestException(
          `schedules[${i}].startAts must not be empty`,
        );
      }

      const seen = new Set<number>();
      startAts.forEach((d, j) => {
        if (!(d instanceof Date) || isNaN(+d)) {
          throw new BadRequestException(
            `schedules[${i}].startAts[${j}] is not a valid date`,
          );
        }

        const t = d.getTime();
        if (seen.has(t)) {
          throw new BadRequestException(
            `Duplicate showtime in schedules[${i}].startAts`,
          );
        }
        seen.add(t);
      });

      roomIds.push(roomId);
    });

    const rooms = await this.roomService.findRoomsByIds(roomIds);
    if (rooms.length !== roomIds.length) {
      throw new BadRequestException('One or more rooms do not exist');
    }

    const theaterId = rooms[0].theaterId;
    if (rooms.some((r) => r.theaterId !== theaterId)) {
      throw new BadRequestException(
        'All rooms must belong to the same theater',
      );
    }

    return rooms;
  }

  private buildShowtimeSchedules(
    movie: MovieLike,
    rooms: RoomLike[],
    schedules: RoomScheduleCriteria[],
  ): ShowtimeRange[] {
    const roomMap = new Map(rooms.map((r) => [r._id, r]));
    const result: ShowtimeRange[] = [];

    // unique (theaterId, roomType, startAt)
    const roomTypeStartMap = new Map<RoomType, Set<number>>();

    schedules.forEach((schedule, i) => {
      const room = roomMap.get(schedule.roomId)!;

      const ranges = schedule.startAts
        .map((rawStart) => {
          const startAt = DateUtil.roundUp(rawStart, ROUND_STEP_MIN);
          const endAt = DateUtil.add(startAt, {
            minutes: movie.duration + GAP_MIN,
          });
          return { startAt, endAt };
        })
        .sort((a, b) => +a.startAt - +b.startAt);

      // 1. overlap same room
      for (let j = 1; j < ranges.length; j++) {
        if (ranges[j - 1].endAt > ranges[j].startAt) {
          const startStr = DateUtil.toDatetimeString(
            schedule.startAts[i],
            'dd-MM-yyyy HH:mm',
          );
          throw new BadRequestException(
            `Showtimes overlap in schedules[${i}]: ${startStr}`,
          );
        }
      }

      // 2. unique by roomType
      let used = roomTypeStartMap.get(room.roomType);
      if (!used) {
        used = new Set<number>();
        roomTypeStartMap.set(room.roomType, used);
      }

      for (const { startAt, endAt } of ranges) {
        const t = startAt.getTime();

        if (used.has(t)) {
          const startStr = DateUtil.toDatetimeString(
            startAt,
            'dd-MM-yyyy HH:mm',
          );
          throw new BadRequestException(
            `Room type ${room.roomType} already has a showtime at ${startStr}`,
          );
        }
        used.add(t);

        result.push({
          movieId: movie._id,
          theaterId: room.theaterId,
          roomId: room._id,
          roomType: room.roomType,
          startAt,
          endAt,
        });
      }
    });

    return result;
  }

  private async assertShowtimeAvailability(
    ranges: ShowtimeRange[],
    rooms: RoomLike[],
  ) {
    if (!ranges.length) return;

    const { movieId, theaterId } = ranges[0];

    const roomMap = new Map<string, RoomLike>();
    for (const r of rooms) {
      roomMap.set(r._id, r);
    }

    const roomIds = [...new Set(ranges.map((r) => r.roomId))];
    const roomTypes = [...new Set(ranges.map((r) => r.roomType))];

    const sorted = [...ranges].sort(
      (a, b) => a.startAt.getTime() - b.startAt.getTime(),
    );
    const firstStart = sorted[0].startAt;
    const lastEnd = sorted[sorted.length - 1].endAt;

    const existing = await this.showtimeRepo.query.findMany({
      filter: {
        isActive: true,
        startAt: { $lt: lastEnd },
        endAt: { $gt: firstStart },
        $or: [
          { roomId: { $in: roomIds } },
          { movieId, theaterId, roomType: { $in: roomTypes } },
        ],
      },
      sort: { startAt: 1 },
    });

    if (!existing.length) return;

    this.assertRoomAvailability(ranges, existing, roomMap);
    this.assertRoomTypeUniqueness(ranges, existing);
  }

  private assertRoomAvailability(
    ranges: ShowtimeRange[],
    existing: ShowtimeLike[],
    roomMap: Map<string, RoomLike>,
  ) {
    const byRoom = new Map<string, ShowtimeLike[]>();
    for (const ex of existing) {
      const list = byRoom.get(ex.roomId);
      if (list) list.push(ex);
      else byRoom.set(ex.roomId, [ex]);
    }

    for (const r of ranges) {
      const list = byRoom.get(r.roomId);
      if (!list) continue;

      const room = roomMap.get(r.roomId);
      const roomName = room?.roomName ?? 'Unknown room';

      for (const ex of list) {
        if (r.startAt < ex.endAt && r.endAt > ex.startAt) {
          const startStr = DateUtil.toDatetimeString(
            ex.startAt,
            'dd-MM-yyyy HH:mm',
          );
          const endStr = DateUtil.toDatetimeString(
            ex.endAt,
            'dd-MM-yyyy HH:mm',
          );

          throw new BadRequestException(
            `${roomName} already has a showtime from ${startStr} to ${endStr}`,
          );
        }
      }
    }
  }

  private assertRoomTypeUniqueness(
    ranges: ShowtimeRange[],
    existing: ShowtimeLike[],
  ) {
    const typeStartSet = new Set<string>();
    for (const ex of existing) {
      typeStartSet.add(`${ex.roomType}|${ex.startAt.getTime()}`);
    }

    for (const r of ranges) {
      const key = `${r.roomType}|${r.startAt.getTime()}`;
      if (!typeStartSet.has(key)) continue;
      const startStr = DateUtil.toDatetimeString(r.startAt, 'dd-MM-yyyy HH:mm');
      throw new BadRequestException(
        `A showtime already exists for room type ${r.roomType} at ${startStr}`,
      );
    }
  }
}
