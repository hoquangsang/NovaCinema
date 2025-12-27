import { Injectable } from '@nestjs/common';
import { BookingSeatQueryRepository } from './booking-seat.query.repository';
import { BookingSeatCommandRepository } from './booking-seat.command.repository';

@Injectable()
export class BookingSeatRepository {
  public constructor(
    public readonly query: BookingSeatQueryRepository,
    public readonly command: BookingSeatCommandRepository,
  ) {}
}
