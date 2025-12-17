import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseDatabaseModule } from './mongoose';

@Module({
  imports: [ConfigModule, MongooseDatabaseModule],
})
export class DatabaseModule {}
