import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database';
import { User, UserSchema } from 'src/modules/users';
import { UserSeederService } from './user-seeder.service';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserSeederService],
  exports: [UserSeederService],
})
export class UsersSeederModule {}
