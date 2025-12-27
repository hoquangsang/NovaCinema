import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommandRepository } from 'src/modules/base/repositories/command';
import { BookingSeat, BookingSeatDocument } from '../schemas';

@Injectable()
export class BookingSeatCommandRepository extends CommandRepository<
  BookingSeat,
  BookingSeatDocument
> {
  public constructor(
    @InjectModel(BookingSeat.name)
    private readonly bookingSeatModel: Model<BookingSeatDocument>,
  ) {
    super(bookingSeatModel);
  }
}
