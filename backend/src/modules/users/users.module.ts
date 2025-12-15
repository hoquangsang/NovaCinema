import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserCommandRepository } from "./repositories/user.command.repository";
import { UserQueryRepository } from "./repositories/user.query.repository";
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserController } from "./controllers/users.controller";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService,
    UserQueryRepository,
    UserCommandRepository,
    UserRepository
  ],
  exports: [
    UserService,
    UserRepository
  ]
})
export class UsersModule {}
