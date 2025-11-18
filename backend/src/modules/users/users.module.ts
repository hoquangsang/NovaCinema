import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/user.repository';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [
  ],
  providers: [
    UserService,
    UserRepository
  ],
  exports: [
    UserService
  ]
})
export class UsersModule {}