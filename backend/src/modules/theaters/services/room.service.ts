import escapeStringRegexp from 'escape-string-regexp';
import { FilterQuery, Types } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { pickSortableFields } from 'src/modules/base/helpers';
import { ROOM_TYPES } from '../constants';
import { RoomType, SeatType } from '../types';
import { RoomDocument } from '../schemas';
import { RoomRepository } from '../repositories';
import { SeatService } from './seat.service';
import { ROOM_QUERY_FIELDS as QUERY_FIELDS } from './room.service.constant';
import { RoomCriteria as Criteria } from './room.service.type';

@Injectable()
export class RoomService {
  public constructor(
    private readonly roomRepo: RoomRepository,
    private readonly seatService: SeatService,
  ) {
    //
  }

  /** */
  public async countRoomsByTheaterId(theaterId: string) {
    return this.roomRepo.query.count({
      filter: {
        theaterId: new Types.ObjectId(theaterId),
      },
    });
  }

  /** */
  public async findRoomById(id: string) {
    const room = await this.roomRepo.query.findOneById({ id });
    if (!room) return null;

    // detail
    return {
      ...room,
      capacity: this.seatService.calculateCapacity(room.seatMap),
    };
  }

  public async findRoomsByIds(roomIds: string[]) {
    const rooms = await this.roomRepo.query.findMany({
      filter: { _id: { $in: roomIds } },
    });

    return rooms.map((room) => {
      const { seatMap, ...rest } = room;
      return {
        ...rest,
        capacity: this.seatService.calculateCapacity(room.seatMap),
      };
    });
  }

  public async findRoomsByTheaterId(
    theaterId: string,
    options: Criteria.Query,
  ) {
    const { sort: rawSort, ...rest } = options;
    const filter = this.buildQueryFilterByTheaterId(theaterId, rest);
    const sort = pickSortableFields(rawSort, QUERY_FIELDS.SORTABLE);

    const rooms = await this.roomRepo.query.findMany({
      filter,
      sort,
    });

    return rooms.map((room) => {
      const { seatMap, ...rest } = room;
      return {
        ...rest,
        capacity: this.seatService.calculateCapacity(room.seatMap),
      };
    });
  }

  public async findRoomsPaginatedByTheaterId(
    theaterId: string,
    options: Criteria.PaginatedQuery,
  ) {
    const { sort: rawSort, page, limit, ...rest } = options;
    const filter = this.buildQueryFilterByTheaterId(theaterId, rest);
    const sort = pickSortableFields(rawSort, QUERY_FIELDS.SORTABLE);

    const result = await this.roomRepo.query.findManyPaginated({
      filter,
      page,
      limit,
      sort,
    });

    const existingRooms = result.items.map((room) => {
      const { seatMap, ...rest } = room;
      return {
        ...rest,
        capacity: this.seatService.calculateCapacity(room.seatMap),
      };
    });

    return {
      items: existingRooms,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  /** */
  public async createRoom(theaterId: string, data: Criteria.Create) {
    const { roomName, roomType = ROOM_TYPES._2D, seatMap: seatMapRaw } = data;

    //
    const existingRoom = await this.roomRepo.query.exists({
      filter: { theaterId, roomName },
    });
    if (existingRoom)
      throw new ConflictException(`Room [${roomName}] already exists`);

    //
    const { insertedItem: createdRoom } = await this.roomRepo.command.createOne(
      {
        data: {
          theaterId: theaterId,
          roomName: roomName,
          roomType: roomType,
          seatMap: this.seatService.buildSeatMap(seatMapRaw),
        },
      },
    );

    if (!createdRoom) throw new BadRequestException('Creation failed');
    return {
      ...createdRoom,
      capacity: this.seatService.calculateCapacity(createdRoom.seatMap),
    };
  }

  /** */
  public async updateRoomById(id: string, update: Criteria.Update) {
    const { roomName, roomType, seatMap: seatMapRaw, isActive } = update;

    const existedRoom = await this.roomRepo.query.findOneById({
      id,
      inclusion: {
        _id: true,
        theaterId: true,
        roomName: true,
      },
    });
    if (!existedRoom) throw new NotFoundException('Room not found');

    if (roomName && roomName !== existedRoom.roomName) {
      const duplicated = await this.roomRepo.query.findOne({
        filter: {
          theaterId: existedRoom.theaterId,
          roomName: roomName,
          _id: { $ne: existedRoom._id },
        },
      });
      if (duplicated)
        throw new ConflictException(`Room [${roomName}] already exists`);
    }

    const seatMap = seatMapRaw
      ? this.seatService.buildSeatMap(seatMapRaw)
      : undefined;

    const { modifiedItem: updatedRoom } =
      await this.roomRepo.command.updateOneById({
        id,
        update: {
          roomName,
          roomType,
          seatMap,
          isActive,
        },
      });

    if (!updatedRoom)
      throw new InternalServerErrorException('Update failed unexpectedly');
    return {
      ...updatedRoom,
      capacity: this.seatService.calculateCapacity(updatedRoom.seatMap),
    };
  }

  /** */
  public async deleteRoomById(id: string) {
    const existing = await this.roomRepo.query.exists({ filter: { _id: id } });
    if (!existing) throw new NotFoundException('Room not found');

    const { deletedCount } = await this.roomRepo.command.deleteOneById({ id });
    if (!deletedCount)
      throw new InternalServerErrorException('Deletion failed unexpectedly');

    // TODO: deactivate all showtime
    return true;
  }

  public async deleteRoomsByTheaterId(theaterId: string) {
    const result = await this.roomRepo.command.deleteMany({
      filter: {
        theaterId: new Types.ObjectId(theaterId),
      },
    });

    // TODO: deactivate all showtimes

    return result.deletedCount;
  }

  /** */
  private buildQueryFilterByTheaterId(
    theaterId: string,
    options: Criteria.Query,
  ) {
    const { search, sort, ...rest } = options;
    const filter: FilterQuery<RoomDocument> = {
      theaterId: theaterId,
    };

    // search fields
    if (search) {
      const r = new RegExp(escapeStringRegexp(search), 'i');
      filter.$or = QUERY_FIELDS.SEARCHABLE.map((f) => ({ [f]: r }));
    }

    // regex fields
    QUERY_FIELDS.REGEX_MATCH.forEach((f) => {
      if (rest[f] !== undefined)
        filter[f] = new RegExp(escapeStringRegexp(rest[f]), 'i');
    });

    // exact match fields
    QUERY_FIELDS.EXACT_MATCH.forEach((f) => {
      if (rest[f] !== undefined) filter[f] = rest[f];
    });

    return filter;
  }
}
