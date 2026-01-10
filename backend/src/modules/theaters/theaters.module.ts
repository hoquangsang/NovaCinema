import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema, Theater, TheaterSchema } from './schemas';
import {
  RoomCommandRepository,
  RoomQueryRepository,
  RoomRepository,
  TheaterCommandRepository,
  TheaterQueryRepository,
  TheaterRepository,
} from './repositories';
import { SeatService, RoomService, TheaterService } from './services';
import { RoomsController, TheatersController } from './controllers';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Theater.name, schema: TheaterSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
  ],
  controllers: [TheatersController, RoomsController],
  providers: [
    TheaterCommandRepository,
    TheaterQueryRepository,
    TheaterRepository,
    TheaterService,

    RoomCommandRepository,
    RoomQueryRepository,
    RoomRepository,
    RoomService,

    SeatService,
  ],
  exports: [TheaterService, RoomService, SeatService],
})
export class TheatersModule {}
