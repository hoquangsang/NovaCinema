import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database';
import { UsersModule } from 'src/modules/users';
import { AuthModule } from 'src/modules/auth';
import { MoviesModule } from './modules/movies';
import { TheatersModule } from './modules/theaters';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // load .env toàn cục
    DatabaseModule,
    UsersModule,
    AuthModule,
    MoviesModule,
    TheatersModule,
  ],
})
export class AppModule {}
