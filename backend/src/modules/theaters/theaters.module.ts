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
import { RoomService, TheaterService } from './services';
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
    TheaterQueryRepository,
    TheaterCommandRepository,
    TheaterRepository,
    TheaterService,

    RoomQueryRepository,
    RoomCommandRepository,
    RoomRepository,
    RoomService,
  ],
  exports: [
    TheaterService,
    TheaterRepository,
    TheaterCommandRepository,
    TheaterQueryRepository,

    RoomService,
    RoomRepository,
    RoomCommandRepository,
    RoomQueryRepository,
  ],
})
export class TheatersModule {}
