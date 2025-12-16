import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseDatabaseModule } from './mongoose/mongoose.module';

@Module({
  imports: [
    ConfigModule,
    MongooseDatabaseModule
  ],
})
export class DatabaseModule {}
