import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommandRepository } from 'src/modules/base/repositories/command';
import { Theater, TheaterDocument } from '../schemas';

@Injectable()
export class TheaterCommandRepository extends CommandRepository<
  Theater,
  TheaterDocument
> {
  public constructor(
    @InjectModel(Theater.name)
    protected readonly theaterModel: Model<TheaterDocument>,
  ) {
    super(theaterModel);
  }
}
