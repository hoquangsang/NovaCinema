import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseRepository } from 'src/modules/shared/repositories';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository extends BaseRepository<User, UserDocument> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  findById(id: string) {
    return super.findById(id);
  }

  findByEmail(email: string) {
    return super.findOne({ email });
  }

  findPaginated (
    options: {
      search?: string;
      page?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
    }
  ) {
    const { search, page = 1, limit = 10 } = options;
    const filter: FilterQuery<UserDocument> = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { username: regex },
        { fullName: regex },
        { email: regex },
      ];
    }

    return super.findPaginated({
      filter,
      sort: options.sort,
      page,
      limit,
    });
  }

  create(data: Partial<User>) {
    return super.create(data);  
  }

  updateById(id: string, updates: Partial<User>) {
    return super.updateById(id, updates);
  }

  deleteById(id: string) {
    return super.deleteById(id);
  }
}