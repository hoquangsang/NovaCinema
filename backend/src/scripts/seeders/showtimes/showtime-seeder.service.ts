import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie, MovieDocument } from 'src/modules/movies';
import { Showtime, ShowtimeDocument } from 'src/modules/showtimes';
import {
  Theater,
  TheaterDocument,
  Room,
  RoomDocument,
} from 'src/modules/theaters';
import {
  addMinutes,
  randomInt,
  shuffle,
  computeMovieEndDate,
  startOfDay,
  addDays,
  minuteToDate,
  roundUp,
  pickMovieShowWindow,
} from './showtime-seeder.helper';

interface RoomSlot {
  roomId: Types.ObjectId;
  roomType: string;
  startAt: Date;
  endAt: Date;
  used: boolean;
}

const OPEN_MINUTE = 8 * 60;
const CLOSE_MINUTE = 22 * 60;

@Injectable()
export class ShowtimeSeederService {
  private readonly logger = new Logger(ShowtimeSeederService.name);

  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<MovieDocument>,
    @InjectModel(Theater.name)
    private readonly theaterModel: Model<TheaterDocument>,
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Showtime.name)
    private readonly showtimeModel: Model<ShowtimeDocument>,
  ) {}

  async seed() {
    await this.showtimeModel.deleteMany({});

    const movies = await this.movieModel.find();
    const theaters = await this.theaterModel.find({ isActive: true });

    this.logger.log(`Movies=${movies.length}`);
    this.logger.log(`Theaters=${theaters.length}`);

    for (const theater of theaters) {
      await this.seedForTheater(theater, movies);
    }

    this.logger.log('Seed showtimes done.');
  }

  private async seedForTheater(
    theater: TheaterDocument,
    movies: MovieDocument[],
  ) {
    const rooms = await this.roomModel.find({
      theaterId: theater._id,
      isActive: true,
    });

    if (!rooms.length) return;

    const slots = this.buildRoomSlots(rooms, movies);
    shuffle(slots);

    const showtimes: ShowtimeDocument[] = [];
    const usedMovieUnique = new Set<string>();

    for (const movie of movies) {
      const movieEnd = computeMovieEndDate(movie);
      const { start, end } = pickMovieShowWindow(movie.releaseDate, movieEnd);

      const movieSlots = slots.filter(
        (s) => !s.used && s.startAt >= start && s.endAt <= end,
      );

      if (!movieSlots.length) continue;

      const weeks = Math.max(
        1,
        Math.ceil((end.getTime() - start.getTime()) / 604_800_000),
      );

      const weeklyTarget = Math.max(3, Math.floor(rooms.length * 0.7));
      const target = weeklyTarget * weeks;

      let picked = 0;

      for (const slot of movieSlots) {
        if (picked >= target) break;

        const uniqueKey = this.movieUniqueKey(
          movie._id,
          theater._id,
          slot.roomType,
          slot.startAt,
        );

        if (usedMovieUnique.has(uniqueKey)) continue;

        slot.used = true;
        usedMovieUnique.add(uniqueKey);
        picked++;

        showtimes.push(
          new this.showtimeModel({
            movieId: movie._id,
            theaterId: theater._id,
            roomId: slot.roomId,
            roomType: slot.roomType,
            startAt: slot.startAt,
            endAt: slot.endAt,
            isActive: true,
          }),
        );
      }
    }

    if (showtimes.length) {
      await this.showtimeModel.insertMany(showtimes, { ordered: false });
    }

    this.logger.log(
      `[Result] ${theater.theaterName}: inserted=${showtimes.length}`,
    );
  }

  private buildRoomSlots(
    rooms: RoomDocument[],
    movies: MovieDocument[],
  ): RoomSlot[] {
    const slots: RoomSlot[] = [];

    const minRelease = new Date(
      Math.min(...movies.map((m) => m.releaseDate.getTime())),
    );
    const maxEnd = new Date(
      Math.max(...movies.map((m) => computeMovieEndDate(m).getTime())),
    );

    const days =
      Math.ceil(
        (startOfDay(maxEnd).getTime() - startOfDay(minRelease).getTime()) /
          86_400_000,
      ) || randomInt(14, 28);

    const maxDuration = Math.max(...movies.map((m) => m.duration));

    for (const room of rooms) {
      for (let i = 0; i < days; i++) {
        const date = addDays(startOfDay(minRelease), i);

        const showCount = randomInt(4, 6);

        const availableMinutes = CLOSE_MINUTE - OPEN_MINUTE;
        const avgBlock = Math.floor(availableMinutes / showCount);

        let cursor = OPEN_MINUTE;

        for (let j = 0; j < showCount; j++) {
          const jitter = randomInt(-10, 10);

          const rawStart = minuteToDate(date, cursor + jitter);
          const startAt = roundUp(rawStart, 5);

          const buffer = randomInt(10, 15);
          const endAt = addMinutes(startAt, maxDuration + buffer);

          if (endAt.getHours() * 60 + endAt.getMinutes() > CLOSE_MINUTE) {
            break;
          }

          slots.push({
            roomId: room._id,
            roomType: room.roomType,
            startAt,
            endAt,
            used: false,
          });

          cursor += avgBlock;
        }
      }
    }

    return slots;
  }

  private movieUniqueKey(
    movieId: Types.ObjectId,
    theaterId: Types.ObjectId,
    roomType: string,
    startAt: Date,
  ) {
    return `${movieId}-${theaterId}-${roomType}-${startAt.getTime()}`;
  }
}
