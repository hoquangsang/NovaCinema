import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';
import { Theater, TheaterSchema } from 'src/modules/theaters/schemas/theater.schema';
import { Room, RoomSchema } from 'src/modules/theaters/schemas/room.schema';
import { Seat, SeatSchema } from 'src/modules/theaters/schemas/seat.schema';
import { TheaterSeederService } from './theater.seeder.service';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Theater.name, schema: TheaterSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Seat.name, schema: SeatSchema },
    ]),
  ],
  providers: [
    TheaterSeederService
  ],
  exports: [
    TheaterSeederService
  ]
})
export class TheaterSeederModule {}