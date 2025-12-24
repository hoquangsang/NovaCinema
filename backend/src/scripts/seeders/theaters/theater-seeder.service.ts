import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Room,
  RoomDocument,
  Theater,
  TheaterDocument,
} from 'src/modules/theaters';
import { THEATERS_MOCK, generateSeatMap } from './theater-seeder.data';

const ROOM_COUNT = 8;
const ROW_COUNT = 8;
const SEATS_PER_ROW = 10;
@Injectable()
export class TheaterSeederService {
  private readonly logger = new Logger(TheaterSeederService.name);

  constructor(
    @InjectModel(Theater.name)
    private readonly theaterModel: Model<TheaterDocument>,

    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
  ) {}

  async seed() {
    this.logger.log('Clearing theaters...');
    await Promise.all([
      this.roomModel.deleteMany(),
      this.theaterModel.deleteMany(),
    ]);

    this.logger.log('Inserting theaters...');
    const theaters = await this.theaterModel.insertMany(THEATERS_MOCK);

    for (const theater of theaters) {
      const theaterId = theater._id;

      for (let i = 1; i <= ROOM_COUNT; i++) {
        const seatMap = generateSeatMap(ROW_COUNT, SEATS_PER_ROW);

        await this.roomModel.create({
          theaterId,
          roomName: `Room ${i}`,
          seatMap,
        });
      }
    }

    this.logger.log(`Theater inserted!`);
  }
}
