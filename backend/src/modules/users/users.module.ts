import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas';
import {
  UserCommandRepository,
  UserQueryRepository,
  UserRepository,
} from './repositories';
import { UserService } from './services';
import { UserController } from './controllers';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserQueryRepository,
    UserCommandRepository,
    UserRepository,
    UserService,
  ],
  exports: [UserRepository, UserService],
})
export class UsersModule {}
