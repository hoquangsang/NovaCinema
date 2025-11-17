import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.getOrThrow<string>("MONGODB_URI");
        const dbName = configService.get<string>("MONGODB_DB_NAME") ?? 'default';

        return { uri, dbName };
      },
    }),
  ],
})
export class DatabaseModule {}
