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
import { ROOM_LIMITS, ROOM_TYPES, SEAT_TYPES } from '../constants';
import { RoomType, SeatType } from '../types';
import { RoomDocument, Seat, SeatMap } from '../schemas';
import { RoomRepository } from '../repositories';
import { ROOM_QUERY_FIELDS as QUERY_FIELDS } from './room.service.constant';
import { RoomCriteria as Criteria } from './room.service.type';

@Injectable()
export class RoomService {
  constructor(private readonly roomRepo: RoomRepository) {}

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
      capacity: this.calculateCapacity(room.seatMap),
    };
  }

  public async findRoomsByIds(roomIds: string[]) {
    const rooms = await this.roomRepo.query.findMany({
      filter: { _id: { $in: roomIds } },
    });

    return rooms.map((room) => ({
      ...room,
      capacity: this.calculateCapacity(room.seatMap),
      seatMap: undefined, // exclude
    }));
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

    return rooms.map((room) => ({
      ...room,
      capacity: this.calculateCapacity(room.seatMap),
      seatMap: undefined, // exclude
    }));
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

    const existingRooms = result.items.map((room) => ({
      ...room,
      capacity: this.calculateCapacity(room.seatMap),
      seatMap: undefined, // exclude
    }));

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
          seatMap: this.buildSeatMap(seatMapRaw),
        },
      },
    );

    if (!createdRoom) throw new BadRequestException('Creation failed');
    return createdRoom;
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

    const seatMap = seatMapRaw ? this.buildSeatMap(seatMapRaw) : undefined;
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
    return updatedRoom;
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

  private calculateCapacity(seatMap: (Seat | null)[][]): number {
    return seatMap
      .flatMap((row) => row)
      .filter((seat) => seat && seat.isActive !== false).length;
  }

  private buildSeatMap(seatMapRaw: (SeatType | null)[][]): SeatMap {
    if (!Array.isArray(seatMapRaw) || seatMapRaw.length === 0)
      throw new BadRequestException('Seat map must be a non-empty 2D array');
    if (
      seatMapRaw.length < ROOM_LIMITS.MIN_ROWS ||
      seatMapRaw.length > ROOM_LIMITS.MAX_ROWS
    )
      throw new BadRequestException(
        `Room must have between ${ROOM_LIMITS.MIN_ROWS} and ${ROOM_LIMITS.MAX_ROWS} rows`,
      );

    return seatMapRaw.map((row, rowIdx) => {
      if (!Array.isArray(row) || row.length === 0)
        throw new BadRequestException(
          `Row ${rowIdx} must be a non-empty array`,
        );
      if (
        row.length < ROOM_LIMITS.MIN_SEATS_PER_ROW ||
        row.length > ROOM_LIMITS.MAX_SEATS_PER_ROW
      )
        throw new BadRequestException(
          `Row ${rowIdx} must have between ${ROOM_LIMITS.MIN_SEATS_PER_ROW} and ${ROOM_LIMITS.MAX_SEATS_PER_ROW} seats`,
        );

      const seatRow: (Seat | null)[] = [];
      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const seatType = row[colIdx];

        if (!seatType) {
          seatRow.push(null);
          continue;
        }

        if (seatType === SEAT_TYPES.COUPLE) {
          if (row[colIdx + 1] !== SEAT_TYPES.COUPLE) {
            throw new BadRequestException(
              `COUPLE seat at row ${rowIdx}, col ${colIdx} must be paired`,
            );
          }
          seatRow.push({
            seatCode: this.generateSeatCode(rowIdx, colIdx),
            seatType: seatType,
          });
          seatRow.push({
            seatCode: this.generateSeatCode(rowIdx, colIdx + 1),
            seatType: seatType,
          });
          colIdx++;
          continue;
        }

        seatRow.push({
          seatCode: this.generateSeatCode(rowIdx, colIdx),
          seatType: seatType,
        });
      }
      return seatRow;
    });
  }

  private generateSeatCode(row: number, col: number): string {
    let n = row;
    let code = '';
    do {
      code = String.fromCharCode(65 + (n % 26)) + code;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);

    return `${code}${col + 1}`;
  }
}
