import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ValidationPipe } from './common/pipes';
import { LoggingInterceptor, ResponseInterceptor } from './common/interceptors';
import { HttpExceptionFilter, MongoExceptionFilter } from './common/filters';
import { JwtAuthGuard, RolesGuard } from './common/guards';
import { DatabaseModule } from './database';
import { UsersModule } from './modules/users';
import { NotificationsModule } from './modules/notifications';
import { AuthModule } from './modules/auth';
import { MoviesModule } from './modules/movies';
import { TheatersModule } from './modules/theaters';
import { TicketPricingModule } from './modules/ticket-pricing';
import { ShowtimesModule } from './modules/showtimes';
import { BookingsModule } from './modules/bookings';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // load .env toàn cục
    DatabaseModule,
    UsersModule,
    AuthModule,
    MoviesModule,
    TheatersModule,
    NotificationsModule,
    TicketPricingModule,
    ShowtimesModule,
    BookingsModule,
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
