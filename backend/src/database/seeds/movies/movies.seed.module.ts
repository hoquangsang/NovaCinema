import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from 'src/modules/movies/schemas/movie.schema';
import { DatabaseModule } from 'src/database/database.module';
import { MovieSeedService } from './movie.seed.service';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema }
    ]),
  ],
  providers: [MovieSeedService],
})
export class MoviesSeedModule {}
