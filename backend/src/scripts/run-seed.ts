import { NestFactory } from '@nestjs/core';
import { MoviesSeedModule } from 'src/database/seeds/movies/movies.seed.module';
import { MovieSeedService } from 'src/database/seeds/movies/movie.seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(MoviesSeedModule);
  const seeder = app.get(MovieSeedService);

  await seeder.seed();

  console.log('Seeding done');
  await app.close();
}

bootstrap();
