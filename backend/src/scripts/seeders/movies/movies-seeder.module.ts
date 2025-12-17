import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from 'src/modules/movies/schemas/movie.schema';
import { DatabaseModule } from 'src/database/database.module';
import { MovieSeederService } from './movie-seeder.service';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  providers: [MovieSeederService],
  exports: [MovieSeederService],
})
export class MoviesSeederModule {}
