import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { Theater, TheaterSchema } from "./schemas/theater.schema";
import { TheaterQueryRepository } from "./repositories/theater.query.repository";
import { TheaterCommandRepository } from "./repositories/theater.command.repository";
import { TheaterRepository } from "./repositories/theater.repository";
import { TheaterService } from "./services/theater.service";
import { TheatersController } from "./controllers/theaters.controller";

import { Room, RoomSchema } from "./schemas/room.schema";
import { RoomQueryRepository } from "./repositories/room.query.repository";
import { RoomCommandRepository } from "./repositories/room.command.repository";
import { RoomRepository } from "./repositories/room.repository";
import { RoomService } from "./services/room.service";
import { RoomsController } from "./controllers/rooms.controller";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Theater.name, schema: TheaterSchema },
      { name: Room.name, schema: RoomSchema },
    ])
  ],
  controllers: [
    TheatersController,
    RoomsController,
  ],
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
  ]
})
export class TheatersModule {}