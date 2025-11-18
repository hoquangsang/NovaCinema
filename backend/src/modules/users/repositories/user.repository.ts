import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';


@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) 
    private readonly model: Model<UserDocument>
  ) {}

  findByEmail(email: string) {
    const filter = {
      email: email
    }

    return this.model
      .findOne(filter)
      .lean()
      .exec();
  }

  async createUser(data: Partial<User>) {
    const doc = await this.model.create(data);

    return doc.toObject({ flattenMaps: true });
  }
}