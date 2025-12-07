import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Theater, TheaterSchema } from "./schemas/theater.schema";
import { Room, RoomSchema } from "./schemas/room.schema";
import { Seat, SeatSchema } from "./schemas/seat.schema";

import { TheaterRepository } from "./repositories/theater.repository";
import { RoomRepository } from "./repositories/room.repository";
import { SeatRepository } from "./repositories/seat.repository";

import { RoomService } from "./services/room.service";
import { SeatService } from "./services/seat.service";
import { TheaterService } from "./services/theater.service";

import { RoomsController } from "./controllers/rooms.controller";
import { SeatsController } from "./controllers/seats.controller";
import { TheatersController } from "./controllers/theaters.controller";


@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Theater.name, schema: TheaterSchema },
        { name: Room.name, schema: RoomSchema },
        { name: Seat.name, schema: SeatSchema }
    ])
  ],
  controllers: [
    TheatersController,
    RoomsController,
    SeatsController
  ],
  providers: [
    TheaterService,
    TheaterRepository,
    RoomService,
    SeatService,
    RoomRepository,
    SeatRepository
  ],
  exports: [
    TheaterService,
    TheaterRepository,
    RoomService,
    RoomRepository,
    SeatService,
    SeatRepository,
  ]
})
export class TheatersModule {}