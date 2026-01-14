import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Room,
  RoomDocument,
  Theater,
  TheaterDocument,
} from 'src/modules/theaters';
import { THEATERS_DATA, generateRoom } from './theater-seeder.data';

const ROOM_2D_COUNT = 5;
const ROOM_3D_COUNT = 2;
const ROOM_VIP_COUNT = 1;

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

      const rooms: Room[] = [];

      // 2D rooms
      for (let i = 1; i <= ROOM_2D_COUNT; i++) {
        rooms.push(generateRoom(theater._id, `Room ${String(i).padStart(2, '0')}`, '2D'));
      }

      // 3D rooms
      for (let i = 1; i <= ROOM_3D_COUNT; i++) {
        rooms.push(generateRoom(theater._id, `Room 3D ${String(i).padStart(2, '0')}`, '3D'));
      }

      // VIP rooms
      for (let i = 1; i <= ROOM_VIP_COUNT; i++) {
        rooms.push(generateRoom(theater._id, `Room VIP ${String(i).padStart(2, '0')}`, 'VIP'));
      }

      await this.roomModel.insertMany(rooms);
      totalRooms += rooms.length;

      const shortName =
        theater.theaterName.length > 30
          ? theater.theaterName.slice(0, 27) + '...'
          : theater.theaterName;

      this.logger.log(
        `[${String(index + 1).padStart(2, '0')}/${theaters.length}] ${shortName.padEnd(
          30,
        )} | inserted ${rooms.length} rooms`,
      );
    }

    this.logger.log(
      `Seed completed: ${theaters.length} theaters, ${totalRooms} rooms inserted.`,
    );
  }
}
