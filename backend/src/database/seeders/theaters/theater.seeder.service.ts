import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Theater, TheaterDocument } from 'src/modules/theaters/schemas/theater.schema';
import { Room, RoomDocument } from 'src/modules/theaters/schemas/room.schema';
import { Seat, SeatDocument } from 'src/modules/theaters/schemas/seat.schema';
import { THEATERS_MOCK, ROOMS_MOCK, generateSeats } from './theater.seeder.data';

@Injectable()
export class TheaterSeederService {
  constructor(
    @InjectModel(Theater.name)
    private readonly theaterModel: Model<TheaterDocument>,

    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,

    @InjectModel(Seat.name)
    private readonly seatModel: Model<SeatDocument>,
  ) {}

  async seed() {
    await this.seatModel.deleteMany();
    await this.roomModel.deleteMany();
    await this.theaterModel.deleteMany();

    const theaters = await this.theaterModel.insertMany(THEATERS_MOCK);

    for (const theater of theaters) {
      const theaterId = theater._id;

      const rooms = await this.roomModel.insertMany(
        ROOMS_MOCK.map(r => ({
          theaterId,
          ...r,
        }))
      );

      for (const room of rooms) {
        const seats = generateSeats(room._id);
        await this.seatModel.insertMany(seats);
      }
    }
  }
}
