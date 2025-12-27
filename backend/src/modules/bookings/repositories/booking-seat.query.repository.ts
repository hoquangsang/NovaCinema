import { ClientSession, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FlattenDocument,
  QueryRepository,
  SortOptions,
} from 'src/modules/base/repositories/query';
import { BookingSeat, BookingSeatDocument } from '../schemas';
import { BOOKING_SEAT_STATUSES } from '../constants';

@Injectable()
export class BookingSeatQueryRepository extends QueryRepository<
  BookingSeat,
  BookingSeatDocument
> {
  public constructor(
    @InjectModel(BookingSeat.name)
    private readonly bookingSeatModel: Model<BookingSeatDocument>,
  ) {
    super(bookingSeatModel);
  }

  public async findUnavailabilitiesByShowtimeId(options: {
    showtimeId: string;
    expiresAt: Date;
    sort?: SortOptions<BookingSeat>;
    session?: ClientSession;
  }): Promise<FlattenDocument<BookingSeat>[]> {
    const { showtimeId, expiresAt, sort, session } = options;
    return this.findMany({
      filter: {
        showtimeId,
        $or: [
          { status: BOOKING_SEAT_STATUSES.SOLD },
          {
            status: BOOKING_SEAT_STATUSES.HOLDING,
            expiresAt: { $gt: expiresAt },
          },
        ],
      },
      session: session,
      sort: sort,
    });
  }
}
