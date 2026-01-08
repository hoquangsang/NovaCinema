import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { UserSeederService } from './users';
import { MovieSeederService } from './movies';
import { TheaterSeederService } from './theaters';
import { ShowtimeSeederService } from './showtimes';
import { SeederModule } from './seeders.module';
import { SeederService } from './seeder.service';

const SEED_TARGETS = {
  USERS: 'users',
  MOVIES: 'movies',
  THEATERS: 'theaters',
  SHOWTIMES: 'showtimes',
  ALL: 'all',
} as const;

type SeedTarget = (typeof SEED_TARGETS)[keyof typeof SEED_TARGETS];

const VALID_TARGETS: SeedTarget[] = Object.values(SEED_TARGETS);

interface Seeder {
  seed(): Promise<void>;
}

const SEEDER_MAP: Record<SeedTarget, new (...args: any[]) => Seeder> = {
  [SEED_TARGETS.USERS]: UserSeederService,
  [SEED_TARGETS.MOVIES]: MovieSeederService,
  [SEED_TARGETS.THEATERS]: TheaterSeederService,
  [SEED_TARGETS.SHOWTIMES]: ShowtimeSeederService,
  [SEED_TARGETS.ALL]: SeederService,
};

/** */
async function bootstrap() {
  const logger = new Logger('Seeder');
  const target: SeedTarget = (process.argv[2] ??
    SEED_TARGETS.ALL) as SeedTarget;

  if (!VALID_TARGETS.includes(target)) {
    console.error(
      `❌ Invalid seed target: ${target}\n` +
        `Valid targets: ${VALID_TARGETS.filter((t) => t !== 'all').join(', ')}`,
    );
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(SeederModule);

  try {
    logger.log(`🚀 Seeding ${target}...`);

    const seeder = app.get(SEEDER_MAP[target]);
    await seeder.seed();

    logger.log('✅ Seed completed!');
  } catch (err) {
    logger.error(err instanceof Error ? err.stack : err);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

bootstrap();
