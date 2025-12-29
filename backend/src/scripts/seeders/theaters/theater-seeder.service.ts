import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Room,
  RoomDocument,
  Theater,
  TheaterDocument,
} from 'src/modules/theaters';
import { THEATERS_DATA, generateSeatMap } from './theater-seeder.data';

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
    this.logger.log('Clearing theaters & rooms...');
    await Promise.all([
      this.roomModel.deleteMany(),
      this.theaterModel.deleteMany(),
    ]);

    this.logger.log(`Inserting ${THEATERS_DATA.length} theaters...`);
    const theaters = await this.theaterModel.insertMany(THEATERS_DATA);

    let totalRooms = 0;

    for (let index = 0; index < theaters.length; index++) {
      const theater = theaters[index];
      const theaterId = theater._id;

      const roomsToInsert: Room[] = [];
      for (let i = 1; i <= ROOM_COUNT; i++) {
        roomsToInsert.push({
          theaterId,
          roomName: `Room ${i}`,
          seatMap: generateSeatMap(ROW_COUNT, SEATS_PER_ROW),
          roomType: '2D',
          capacity: ROW_COUNT * SEATS_PER_ROW,
        });
      }

      await this.roomModel.insertMany(roomsToInsert);
      totalRooms += roomsToInsert.length;

      const shortName =
        theater.theaterName.length > 30
          ? theater.theaterName.slice(0, 27) + '...'
          : theater.theaterName;

      this.logger.log(
        `[${String(index + 1).padStart(2, '0')}/${theaters.length}] ${shortName.padEnd(30)} | inserted ${roomsToInsert.length} rooms`,
      );
    }

    this.logger.log(
      `Seed completed: ${theaters.length} theaters, ${totalRooms} rooms inserted.`,
    );
  }
}
