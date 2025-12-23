import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommandRepository } from 'src/modules/base/repositories/command';
import { Showtime, ShowtimeDocument } from '../schemas/showtime.schema';

@Injectable()
export class ShowtimeCommandRepository extends CommandRepository<
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
