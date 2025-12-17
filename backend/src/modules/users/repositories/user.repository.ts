import { Injectable } from '@nestjs/common';
import { UserQueryRepository } from './user.query.repository';
import { UserCommandRepository } from './user.command.repository';

@Injectable()
export class UserRepository {
  public constructor(
    public readonly query: UserQueryRepository,
    public readonly command: UserCommandRepository,
  ) {}
}
