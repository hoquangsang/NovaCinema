import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { UserSeederService } from './users';
import { MovieSeederService } from './movies';
import { TheaterSeederService } from './theaters';
import { SeederModule } from './seeders.module';
import { SeederService } from './seeder.service';

type SeedTarget = 'users' | 'movies' | 'theaters' | 'all';
const VALID_TARGETS: SeedTarget[] = ['users', 'movies', 'theaters', 'all'];

async function bootstrap() {
  const logger = new Logger('Seeder');
  const target: SeedTarget = (process.argv[2] ?? 'all') as SeedTarget;

  if (!VALID_TARGETS.includes(target)) {
    console.error(
      `❌ Invalid seed target: ${target}\n\nValid targets: ${VALID_TARGETS.join(', ')}`,
    );
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(SeederModule);

  const seederMap: Record<SeedTarget, any> = {
    users: UserSeederService,
    movies: MovieSeederService,
    theaters: TheaterSeederService,
    all: SeederService,
  };

  try {
    logger.log(`🚀 Seeding ${target}...`);
    await app.get(seederMap[target]).seed();
    logger.log('✅ Seed completed!');
  } catch (err) {
    logger.error(err);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

bootstrap();
