import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingInterceptor, TimeoutInterceptor, TransformInterceptor } from './common/interceptors';
import { HttpExceptionFilter, MongoExceptionFilter } from './common/filters';
import { RolesGuard, JwtAuthGuard } from './common/guards';
import { ValidationPipe } from './common/pipes';
import { DatabaseModule } from './database';
import { UsersModule } from './modules/users';
import { AuthModule } from './modules/auth';
import { MoviesModule } from './modules/movies';
import { TheatersModule } from './modules/theaters';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // load .env toàn cục
    DatabaseModule,
    UsersModule,
    AuthModule,
    MoviesModule,
    TheatersModule,
  ],
  controllers: [
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongoExceptionFilter,
    },

    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
