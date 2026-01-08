import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryRepository } from 'src/modules/base/repositories/query';
import { RoomType } from 'src/modules/theaters/types';
import { Showtime, ShowtimeDocument } from '../schemas/showtime.schema';

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
}
