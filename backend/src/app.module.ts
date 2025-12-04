import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { MailModule } from './mail';
import { UsersModule } from './modules/users';
import { AuthModule } from './modules/auth';
import { MoviesModule } from './modules/movies';
import { TheatersModule } from './modules/theaters';
import { ValidationPipe } from './common/pipes';
import { LoggingInterceptor } from './common/interceptors';
import { HttpExceptionFilter, MongoExceptionFilter } from './common/filters';
import { JwtAuthGuard, RolesGuard } from './common/guards';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // load .env toàn cục
    DatabaseModule,
    MailModule,
    UsersModule,
    AuthModule,
    MoviesModule,
    TheatersModule,
  ],

  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: MongoExceptionFilter },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
