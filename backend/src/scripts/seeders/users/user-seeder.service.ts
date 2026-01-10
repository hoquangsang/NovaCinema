import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/users';
import { USERS_DATA } from './user-seeder.data';

@Injectable()
export class UserSeederService {
  private readonly logger = new Logger(UserSeederService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async seed() {
    this.logger.log('Clearing users...');
    await this.userModel.deleteMany({});

    this.logger.log('Inserting users...');
    await this.userModel.insertMany(USERS_DATA);

    this.logger.log(`Users inserted!`);
  }
}
