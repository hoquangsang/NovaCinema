import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MoviesModule } from './modules/movies/movies.module';
import { TheatersModule } from './modules/theaters/theaters.module';

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
