import escapeStringRegexp from 'escape-string-regexp';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { TimeHHmm } from 'src/common/types';
import { DateUtil, TimeUtil } from 'src/common/utils';
import { MovieService } from 'src/modules/movies';
import { RoomService } from 'src/modules/theaters';
import { ShowtimeDocument } from '../schemas';
import { ShowtimeRepository } from '../repositories/showtime.repository';
import {
  SHOWTIME_QUERY_FIELDS as QUERY_FIELDS,
  SHOWTIME_ROUND_STEP_MIN as ROUND_STEP_MIN,
  SHOWTIME_GAP_MIN as GAP_MIN,
} from './showtime.service.constant';
import {
  MovieLike,
  RoomLike,
  ShowtimeLike,
  Range,
  ShowtimeCriteria as Criteria,
  ShowtimeResult as Result,
} from './showtime.service.type';
import { RoomType } from 'src/modules/theaters/types';

@Injectable()
export class ShowtimeService {
  public constructor(
    private readonly showtimeRepo: ShowtimeRepository,
    private readonly roomService: RoomService,
    private readonly movieService: MovieService,
  ) {}

  /******************************** */
  public async findShowtimeById(id: string) {
    return this.showtimeRepo.query.findOneByIdPopulated(id);
  }

  public async findShowtimes(options: Criteria.QueryRange) {
    const { ...rest } = options;
    const filter = this.buildShowtimeFilter(rest);

    return this.showtimeRepo.query.findManyLight({
      filter,
      sort: { startAt: 1 },
    });
  }

  public async findShowtimesByDate(options: Criteria.QueryByDate) {
    const { date, ...rest } = options;

    const startAt = DateUtil.startOfDay(date);
    const endAt = DateUtil.endOfDay(date);

    return this.findShowtimes({
      ...rest,
      from: startAt,
      to: endAt,
    });
  }

  public async findAvailableShowtimes(options: Criteria.QueryAvailable) {
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

  public async findShowtimesPaginated(options: Criteria.PaginatedQueryRange) {
    const { page, limit, ...rest } = options;
    const filter = this.buildShowtimeFilter(rest);

    const result = await this.showtimeRepo.query.findManyPaginatedLight({
      filter,
      page,
      limit,
      sort: { startAt: 1 },
    });

    return {
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  /******************************** */
  public async createSingleShowtime(data: Criteria.Create) {
    const { movieId, roomId, startAt } = data;

    // Delegate qua bulk
    const showtimes = await this.createBulkShowtimes({
      movieId,
      roomIds: [roomId],
      startAts: [startAt],
    });

    return showtimes[0];
  }

  public async createBulkShowtimes(data: Criteria.CreateBulk) {
    const { movieId, roomIds, startAts } = data;

    // 1. input
    const inputVal = this.validateCreationInput(data);
    if (!inputVal.valid) {
      throw new BadRequestException({
        message: 'Invalid input',
        errors: inputVal.errors,
      });
    }

    // 2. movie
    const movieVal = await this.getValidatedMovie(movieId);
    if (!movieVal.valid) {
      throw new BadRequestException({
        message: 'Invalid movie',
        errors: movieVal.errors,
      });
    }
    const movie = movieVal.value;

    // 3. rooms
    const roomsVal = await this.getValidatedRooms(roomIds);
    if (!roomsVal.valid) {
      throw new BadRequestException({
        message: 'Invalid roomIds',
        errors: roomsVal.errors,
      });
    }
    const rooms = roomsVal.value;

    // 4. ranges
    const rangesVal = this.getValidatedShowtimeRanges(startAts, movie);
    if (!rangesVal.valid) {
      throw new BadRequestException({
        message: 'Invalid showtime ranges',
        errors: rangesVal.errors,
      });
    }
    const ranges = rangesVal.value;

    // 5. conflicts
    const conflictVal = await this.getValidatedConflicts(movie, rooms, ranges);
    if (!conflictVal.valid) {
      throw new ConflictException({
        message: 'Showtime conflict',
        errors: conflictVal.errors,
      });
    }

    // 6. create docs
    const docs = rooms.flatMap((room) =>
      ranges.map((r) => ({
        movieId,
        theaterId: room.theaterId,
        roomId: room._id,
        roomType: room.roomType,
        startAt: r.startAt,
        endAt: r.endAt,
      })),
    );

    try {
      const { insertedCount, insertedItems } =
        await this.showtimeRepo.command.createMany({ data: docs });

      if (insertedCount !== docs.length) {
        throw new InternalServerErrorException('Create failed');
      }

      return insertedItems;
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Duplicate showtime');
      }
      throw err;
    }
  }

  public async createRepeatedShowtimes(data: Criteria.CreateRepeated) {
    const { movieId, roomIds, startTimes, repeatDates } = data;

    // 1. build + validate startAts
    const startAtsVal = this.getValidatedRepeatedStartAts(
      startTimes,
      repeatDates,
    );
    if (!startAtsVal.valid) {
      throw new BadRequestException({
        message: 'Invalid repeated start times',
        errors: startAtsVal.errors,
      });
    }
    const startAts = startAtsVal.value;

    // 2. delegate bulk
    return this.createBulkShowtimes({
      movieId,
      roomIds,
      startAts,
    });
  }

  /** */
  public async validateSingleCreation(
    data: Criteria.Create,
  ): Promise<Result.Validation> {
    const { movieId, roomId, startAt } = data;
    return await this.validateBulkCreation({
      movieId: movieId,
      roomIds: [roomId],
      startAts: [startAt],
    });
  }

  public async validateBulkCreation(
    data: Criteria.CreateBulk,
  ): Promise<Result.Validation> {
    // 1. input
    const inputVal = this.validateCreationInput(data);
    if (!inputVal.valid) return inputVal;

    const { movieId, roomIds, startAts } = data;
    // 2. movie
    const movieVal = await this.getValidatedMovie(movieId);
    if (!movieVal.valid) return movieVal;
    const { value: movie } = movieVal;

    // 3. rooms
    const roomsVal = await this.getValidatedRooms(roomIds);
    if (!roomsVal.valid) return roomsVal;
    const { value: rooms } = roomsVal;

    // 4. ranges
    const rangesVal = this.getValidatedShowtimeRanges(startAts, movie);
    if (!rangesVal.valid) return rangesVal;
    const { value: ranges } = rangesVal;

    // 5. conflicts (room conflict + unique roomType conflict)
    const conflictVal = await this.getValidatedConflicts(movie, rooms, ranges);
    if (!conflictVal.valid) return conflictVal;

    return this.success();
  }

  public async validateRepeatedCreation(
    data: Criteria.CreateRepeated,
  ): Promise<Result.Validation> {
    const { movieId, roomIds, startTimes, repeatDates } = data;

    // 1. Validate & build startAts
    const startAtsVal = this.getValidatedRepeatedStartAts(
      startTimes,
      repeatDates,
    );
    if (!startAtsVal.valid) return startAtsVal;
    const { value: startAts } = startAtsVal;

    // 2. Delegate bulk creation
    return this.validateBulkCreation({
      movieId,
      roomIds,
      startAts,
    });
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

  public async deleteShowtimes(options: Criteria.DeleteBulk) {
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
  private buildShowtimeFilter(options: Criteria.QueryRange) {
    const {
      search,
      movieId,
      theaterId,
      roomId,
      from: startAt,
      to: endAt,
      ...rest
    } = options;

    const filter: FilterQuery<ShowtimeDocument> = {};
    if (movieId) filter.movieId = new Types.ObjectId(movieId);
    if (theaterId) filter.theaterId = new Types.ObjectId(theaterId);
    if (roomId) filter.roomId = new Types.ObjectId(roomId);

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

  /** */
  private validateCreationInput(data: Criteria.CreateBulk): Result.Validation {
    const { movieId, roomIds, startAts } = data;
    const errors: string[] = [];

    if (!movieId) {
      errors.push('movieId is required');
    }

    if (!roomIds?.length) {
      errors.push('roomIds is required');
    }

    if (!startAts?.length) {
      errors.push('startAts is required');
    }

    if (startAts?.length) {
      const seen = new Set<number>();
      const dupIndexes: number[] = [];

      startAts.forEach((d, i) => {
        if (!(d instanceof Date) || isNaN(+d)) {
          errors.push(`startAts[${i}] is invalid date`);
          return;
        }

        const t = d.getTime();
        if (seen.has(t)) dupIndexes.push(i);
        else seen.add(t);
      });

      if (dupIndexes.length) {
        dupIndexes.forEach((i) =>
          errors.push(`Duplicate startAt at index ${i}`),
        );
      }
    }

    if (Object.keys(errors).length) {
      return this.failure('input', errors);
    }

    return this.success();
  }

  /** */
  private async getValidatedMovie(
    movieId: string,
  ): Promise<Result.ValidationResult<MovieLike>> {
    const movie = await this.movieService.findMovieById(movieId);
    if (!movie) {
      return this.failure('movieId', ['Movie not found']);
    }

    const errors: string[] = [];
    if (movie.duration <= 0)
      errors.push('Movie duration must be greater than 0');
    if (!movie.releaseDate) errors.push('Movie release date is required');
    if (errors.length) return this.failure('movieId', errors);

    return this.successResult(movie);
  }

  /** */
  private async getValidatedRooms(
    roomIds: string[],
  ): Promise<Result.ValidationResult<RoomLike[]>> {
    // check duplicate
    const seen = new Set<string>();
    const dup: string[] = [];
    for (const id of roomIds) {
      if (seen.has(id)) dup.push(id);
      else seen.add(id);
    }
    if (dup.length) {
      return this.failure(
        'roomIds',
        dup.map((id) => `Duplicate roomId: ${id}`),
      );
    }

    // check missing room
    const rooms = await this.roomService.findRoomsByIds(roomIds);
    const found = new Set(rooms.map((r) => r._id));
    const missing = roomIds.filter((id) => !found.has(id));
    if (missing.length) {
      return this.failure(
        'roomIds',
        missing.map((id) => `Room not found: ${id}`),
      );
    }

    // check same theater
    let theaterId: string | null = null;
    for (const room of rooms) {
      if (!theaterId) theaterId = room.theaterId;
      else if (room.theaterId !== theaterId) {
        return this.failure('roomIds', [
          'All rooms must belong to the same theater',
        ]);
      }
    }

    return this.successResult(rooms);
  }

  /** */
  private getValidatedShowtimeRanges(
    startAts: Date[],
    movie: MovieLike,
  ): Result.ValidationResult<Range[]> {
    // 1. build
    const slots = startAts
      .map((raw) => {
        const startAt = DateUtil.roundDown(raw, ROUND_STEP_MIN);
        const endAt = DateUtil.roundUp(
          DateUtil.add(startAt, {
            minutes: movie.duration + GAP_MIN,
          }),
          ROUND_STEP_MIN,
        );
        return {
          startAt,
          endAt,
          label: DateUtil.toDatetimeString(startAt, 'yyyy-MM-dd HH:mm'),
        };
      })
      .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());

    const rangeErrors: string[] = [];

    // 1. validate
    for (const it of slots) {
      const validation = this.validateShowtimeRange(
        it.startAt,
        it.endAt,
        movie,
      );
      if (!validation.valid) {
        validation.errors.forEach((msg) => {
          rangeErrors.push(`[${it.label}] ${msg}`);
        });
      }
    }
    if (rangeErrors.length) {
      return this.failure('startAts', rangeErrors);
    }

    // 2. overlap
    const overlapErrors: string[] = [];

    for (let i = 1; i < slots.length; i++) {
      const prev = slots[i - 1];
      const curr = slots[i];

      if (prev.endAt > curr.startAt) {
        overlapErrors.push(
          `[${prev.label}] overlaps with next showtime [${curr.label}]`,
        );
      }
    }

    if (overlapErrors.length) {
      return this.failure('startAts', overlapErrors);
    }

    const ranges: Range[] = slots.map((it) => ({
      startAt: it.startAt,
      endAt: it.endAt,
    }));

    return this.successResult(ranges);
  }

  private validateShowtimeRange(
    startAt: Date,
    endAt: Date,
    movie: MovieLike,
  ): Result.Validation {
    const errors: string[] = [];
    const now = DateUtil.roundDown(DateUtil.now(), ROUND_STEP_MIN);

    const push = (msg: string) => {
      errors.push(msg);
    };

    if (startAt < now) {
      push('showtime is in the past');
    }

    if (startAt < movie.releaseDate) {
      push(`before release date (${DateUtil.toDateString(movie.releaseDate)})`);
    }

    if (startAt >= endAt) {
      push('invalid showtime range');
    }

    if (movie.endDate && endAt > movie.endDate) {
      push(`exceeds movie end date (${DateUtil.toDateString(movie.endDate)})`);
    }

    if (errors.length) {
      return {
        valid: false,
        field: 'startAts',
        errors,
      };
    }

    return { valid: true };
  }

  /** */
  private async getValidatedConflicts(
    movie: MovieLike,
    rooms: RoomLike[],
    ranges: Range[],
  ): Promise<Result.Validation> {
    const theaterId = rooms[0].theaterId;

    const sortedRanges = [...ranges].sort(
      (a, b) => a.startAt.getTime() - b.startAt.getTime(),
    );

    const roomIds = rooms.map((r) => r._id);
    const roomTypes = [...new Set(rooms.map((r) => r.roomType))];

    const firstStart = sortedRanges[0].startAt;
    const lastEnd = sortedRanges[sortedRanges.length - 1].endAt;

    // 1. Load các showtime có khả năng conflict
    const existingVal = await this.queryExistingShowtimes(
      movie,
      theaterId,
      roomIds,
      roomTypes,
      firstStart,
      lastEnd,
    );
    if (!existingVal.valid) return existingVal;
    const { value: existing } = existingVal;
    if (!existing.length) return this.success();

    // 2. Validate conflict by room
    const roomVal = this.validateRoomConflicts(rooms, sortedRanges, existing);
    if (!roomVal.valid) return roomVal;

    // 3. Validate conflict unique index
    const uniqueVal = this.validateUniqueConflicts(
      movie,
      theaterId,
      rooms,
      sortedRanges,
      existing,
    );
    if (!uniqueVal.valid) return uniqueVal;

    return this.success();
  }

  private async queryExistingShowtimes(
    movie: MovieLike,
    theaterId: string,
    roomIds: string[],
    roomTypes: RoomType[],
    firstStart: Date,
    lastEnd: Date,
  ): Promise<Result.ValidationResult<ShowtimeLike[]>> {
    try {
      const result = await this.showtimeRepo.query.findMany({
        filter: {
          isActive: true,
          startAt: { $lt: lastEnd },
          endAt: { $gt: firstStart },
          $or: [
            { roomId: { $in: roomIds } },
            {
              movieId: movie._id,
              theaterId,
              roomType: { $in: roomTypes },
            },
          ],
        },
        sort: { startAt: 1 },
      });

      return this.successResult(result);
    } catch (err) {
      return this.failure('conflicts', ['Failed to load existing showtimes']);
    }
  }

  private validateRoomConflicts(
    rooms: RoomLike[],
    ranges: Range[],
    existing: ShowtimeLike[],
  ): Result.Validation {
    const errors: string[] = [];

    // Group existing by room
    const mapByRoom: Record<string, ShowtimeLike[]> = {};
    for (const ex of existing) {
      (mapByRoom[ex.roomId] ??= []).push(ex);
    }

    // For each room → check overlap
    for (const room of rooms) {
      const roomExisting = mapByRoom[room._id];
      if (!roomExisting?.length) continue;

      const sortedExisting = [...roomExisting].sort(
        (a, b) => a.startAt.getTime() - b.startAt.getTime(),
      );

      let i = 0;
      let j = 0;

      while (i < ranges.length && j < sortedExisting.length) {
        const r = ranges[i];
        const ex = sortedExisting[j];

        if (r.endAt <= ex.startAt) {
          i++;
          continue;
        }
        if (r.startAt >= ex.endAt) {
          j++;
          continue;
        }

        // Overlap
        errors.push(
          `Room ${room.roomName} (${room._id}) conflicts with existing showtime at ${DateUtil.toDatetimeString(
            ex.startAt,
          )}`,
        );

        i++;
      }
    }

    if (Object.keys(errors).length) {
      return this.failure('roomIds', errors);
    }

    return this.success();
  }

  private validateUniqueConflicts(
    movie: MovieLike,
    theaterId: string,
    rooms: RoomLike[],
    ranges: Range[],
    existing: ShowtimeLike[],
  ): Result.Validation {
    const errors: string[] = [];

    // Group existing by roomType
    const mapByType: Record<RoomType, ShowtimeLike[]> = {
      '2D': [],
      '3D': [],
      VIP: [],
    };
    for (const ex of existing) {
      if (mapByType[ex.roomType]) {
        mapByType[ex.roomType].push(ex);
      }
    }

    for (const room of rooms) {
      const rt = room.roomType;
      const list = mapByType[rt];
      if (!list?.length) continue;

      const sortedExisting = [...list].sort(
        (a, b) => a.startAt.getTime() - b.startAt.getTime(),
      );

      let i = 0;
      let j = 0;

      while (i < ranges.length && j < sortedExisting.length) {
        const r = ranges[i];
        const ex = sortedExisting[j];

        const tR = r.startAt.getTime();
        const tE = ex.startAt.getTime();

        if (tR === tE) {
          if (
            ex.movieId === movie._id &&
            ex.theaterId === theaterId &&
            ex.roomType === rt
          ) {
            errors.push(
              `Duplicate unique showtime: movie=${movie._id}, theater=${theaterId}, roomType=${rt}, startAt=${DateUtil.toDatetimeString(
                r.startAt,
              )}`,
            );
          }
          i++;
          continue;
        }

        if (tR < tE) i++;
        else j++;
      }
    }

    if (Object.keys(errors).length) {
      return this.failure('roomTypes', errors);
    }

    return this.success();
  }

  /** */
  private getValidatedRepeatedStartAts(
    startTimes: TimeHHmm[],
    repeatDates: Date[],
  ): Result.ValidationResult<Date[]> {
    // 1. Validate input required
    if (!startTimes?.length) {
      return this.failure('startTimes', ['startTimes is required']);
    }

    if (!repeatDates?.length) {
      return this.failure('repeatDates', ['repeatDates is required']);
    }

    // 2. Validate time format
    for (let i = 0; i < startTimes.length; i++) {
      const t = startTimes[i];
      if (!TimeUtil.isValidHHmm(t)) {
        return this.failure('startTimes', [
          `Invalid HH:mm format at index ${i}: ${t}`,
        ]);
      }
    }

    // 3. Build startAts
    const startAts: Date[] = [];
    for (const date of repeatDates) {
      const base = DateUtil.startOfDay(date);
      for (const time of startTimes) {
        const minutesOfDay = TimeUtil.toMinutes(time);
        const startAt = DateUtil.setMinutesOfDay(base, minutesOfDay);
        startAts.push(startAt);
      }
    }

    startAts.sort((a, b) => a.getTime() - b.getTime());

    return this.successResult(startAts);
  }

  /** */
  private success(): Result.ValidationSuccess {
    return { valid: true };
  }

  private successResult<T>(
    value: T,
    message?: string,
  ): Result.ValidationResult<T> {
    return { valid: true, value, message };
  }

  private failure(
    field: string,
    errors: string[],
    message?: string,
  ): Result.ValidationFailure {
    return { valid: false, field, errors, message };
  }
}
