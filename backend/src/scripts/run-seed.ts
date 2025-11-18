import { NestFactory } from '@nestjs/core';
import { SeederModule } from 'src/database/seeders/seeders.module';
import { SeederService } from 'src/database/seeders/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  const seeder = app.get(SeederService);
  await seeder.seedAll();

  await app.close();
}

bootstrap();