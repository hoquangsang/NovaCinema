import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ValidationPipe } from './common/pipes';
import { LoggingInterceptor, ResponseInterceptor } from './common/interceptors';
import { HttpExceptionFilter, MongoExceptionFilter } from './common/filters';
import { JwtAuthGuard, RolesGuard } from './common/guards';
import { DatabaseModule } from './database';
import { UsersModule } from './modules/users';
import { AuthModule } from './modules/auth';
import { MoviesModule } from './modules/movies';
import { TheatersModule } from './modules/theaters';
import { NotificationsModule } from './modules/notifications';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // load .env toàn cục
    DatabaseModule,
    NotificationsModule,
    UsersModule,
    AuthModule,
    MoviesModule,
    TheatersModule,
  ],

  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: MongoExceptionFilter },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
