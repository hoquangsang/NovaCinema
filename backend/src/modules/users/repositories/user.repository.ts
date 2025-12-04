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
  findById(id: string) {
    return this.model
      .findById(id)
      .lean()
      .exec();
  }

  findByEmail(email: string) {
    const filter = {
      email: email
    }

    return this.model
      .findOne(filter)
      .lean()
      .exec();
  }

  async createUser(
    data: {
      email: string;
      password: string;
      username?: string;
      fullName?: string;
      phoneNumber?: string;
      dateOfBirth?: string;
    }
  ) {
    const doc = await this.model.create(data);

    return doc.toObject({ flattenMaps: true });
  }

  async updateByFilter(
    filter: { [key: string]: any },
    updates: {
      username?: string;
      fullName?: string;
      phoneNumber?: string;
      dateOfBirth?: string;
      emailVerified?: boolean;
      lastLogin?: Date;
    },
  ) {
    return this.model
      .findOneAndUpdate(
        filter,
        { $set: updates },
        { new: true, lean: true, runValidators: true }
      )
      .exec();
  }

  async markEmailVerified(email: string) {
    const filter = {
      email: email
    }
    return this.updateByFilter(
      filter,
      { emailVerified: true }
    );
  }
}