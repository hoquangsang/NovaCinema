import { Injectable } from '@nestjs/common';
import { BookingQueryRepository } from './booking.query.repository';
import { BookingCommandRepository } from './booking.command.repository';

@Injectable()
export class BookingRepository {
  public constructor(
    public readonly query: BookingQueryRepository,
    public readonly command: BookingCommandRepository,
  ) {}
}
