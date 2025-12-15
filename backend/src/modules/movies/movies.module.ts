import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Movie, MovieSchema } from './schemas/movie.schema';
import { MovieRepository } from "./repositories/movie.repository";
import { MovieQueryRepository } from "./repositories/movie.query.repository";
import { MovieCommandRepository } from "./repositories/movie.command.repository";
import { MovieService } from "./services/movie.service";
import { MoviesController } from "./controllers/movies.controller";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema}])
  ],
  controllers: [
    MoviesController
  ],
  providers: [
    MovieService,
    MovieRepository,
    MovieQueryRepository,
    MovieCommandRepository,
  ],
  exports: [
    MovieService,
    MovieRepository,
  ]
})
export class MoviesModule {}