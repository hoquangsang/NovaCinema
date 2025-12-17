import { ClientSession, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  IncludeProjection,
  ExcludeProjection,
  FlattenDocument,
  FlattenProjectionDocument,
} from 'src/modules/base/repositories/query';
import { QueryRepository } from 'src/modules/base/repositories/query';
import { User, UserDocument } from '../schemas';

@Injectable()
export class UserQueryRepository extends QueryRepository<User, UserDocument> {
  public constructor(
    @InjectModel(User.name)
    protected readonly theaterModel: Model<UserDocument>,
  ) {
    super(theaterModel);
  }

  /**
   * @param options
   */
  public async findOneByEmail(options: {
    email: string;
    session?: ClientSession;
  }): Promise<FlattenDocument<User> | null>;

  public async findOneByEmail<
    P extends IncludeProjection<FlattenDocument<User>>,
  >(options: {
    email: string;
    inclusion: P;
    session?: ClientSession;
  }): Promise<FlattenProjectionDocument<User, P> | null>;

  public async findOneByEmail<
    P extends ExcludeProjection<FlattenDocument<User>>,
  >(options: {
    email: string;
    exclusion: P;
    session?: ClientSession;
  }): Promise<FlattenProjectionDocument<User, P> | null>;

  public async findOneByEmail(options: any = {}): Promise<any> {
    const { email, inclusion, exclusion, session } = options;
    const filter = { email };
    if (inclusion) {
      return super.findOne({ filter, inclusion, session });
    }
    if (exclusion) {
      return super.findOne({ filter, exclusion, session });
    }
    return super.findOne({ filter, session });
  }
}
