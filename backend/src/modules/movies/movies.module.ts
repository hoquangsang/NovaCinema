import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Movie, MovieSchema } from './schemas/movie.schema';
import { MovieRepository } from "./repositories/movie.repository";
import { MovieService } from "./services/movie.service";
import { MoviesController } from "./controllers/movies.controller";


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema}])
  ],
  controllers: [
    MoviesController
  ],
  providers: [
    MovieService,
    MovieRepository,
  ]
})
export class MoviesModule {}