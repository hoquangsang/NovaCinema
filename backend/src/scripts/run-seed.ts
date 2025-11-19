import { NestFactory } from '@nestjs/core';
import { SeederModule, SeederService } from 'src/database/seeders';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  const seeder = app.get(SeederService);
  await seeder.seedAll();

  await app.close();
}

bootstrap();