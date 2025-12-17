import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schemas';
import {
  MovieCommandRepository,
  MovieQueryRepository,
  MovieRepository,
} from './repositories';
import { MovieService } from './services';
import { MoviesController } from './controllers';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MoviesController],
  providers: [
    MovieService,
    MovieRepository,
    MovieQueryRepository,
    MovieCommandRepository,
  ],
  exports: [MovieService, MovieRepository],
})
export class MoviesModule {}
