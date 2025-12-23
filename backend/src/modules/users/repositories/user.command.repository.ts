import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommandRepository } from 'src/modules/base/repositories/command';
import { User, UserDocument } from '../schemas';

@Injectable()
export class UserCommandRepository extends CommandRepository<
  User,
  UserDocument
> {
  public constructor(
    @InjectModel(User.name)
    protected readonly theaterModel: Model<UserDocument>,
  ) {
    super(theaterModel);
  }
}
