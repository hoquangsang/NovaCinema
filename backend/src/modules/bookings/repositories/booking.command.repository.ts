import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommandRepository } from 'src/modules/base/repositories/command';
import { Booking, BookingDocument } from '../schemas';

@Injectable()
export class BookingCommandRepository extends CommandRepository<
  Booking,
  BookingDocument
> {
  public constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {
    super(bookingModel);
  }
}
