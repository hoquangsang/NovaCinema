import { ConfigService } from '@nestjs/config';

export const mongooseConfig = (config: ConfigService) => ({
  uri: config.getOrThrow<string>('MONGODB_URI'),
  dbName: config.get<string>('MONGODB_DB_NAME') ?? 'default',
});
