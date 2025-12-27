import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryRepository } from 'src/modules/base/repositories/query';
import { Booking, BookingDocument } from '../schemas';

@Injectable()
export class BookingQueryRepository extends QueryRepository<
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
