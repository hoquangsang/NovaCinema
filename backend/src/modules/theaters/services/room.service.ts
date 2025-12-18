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
import { ROOM_LIMITS, SEAT_TYPES } from '../constants';
import { RoomType, SeatType } from '../types';
import { RoomDocument, Seat, SeatMap } from '../schemas';
import { RoomRepository } from '../repositories';
import { RoomInputTypes as InputTypes } from './room.service.type';
import { RoomQueryFields as QUERY_FIELDS } from './room.service.constant';

@Injectable()
export class RoomService {
  constructor(private readonly roomRepo: RoomRepository) {}

  /** */
  public async findRoomById(id: string) {
    return this.roomRepo.query.findOneById({ id });
  }

  /** */
  public async findRoomsByTheaterId(
    theaterId: string,
    options: InputTypes.Query,
  ) {
    const { search, sort: rawSort, ...rest } = options;
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

    // safe sort
    const sort = pickSortableFields(rawSort, QUERY_FIELDS.SORTABLE);

    //
    return this.roomRepo.query.findMany({
      filter,
      sort,
    });
  }

  /** */
  public async findRoomsPaginatedByTheaterId(
    theaterId: string,
    options: InputTypes.PaginatedQuery,
  ) {
    const { search, sort: rawSort, page, limit, ...rest } = options;
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

    // safe sort
    const sort = pickSortableFields(rawSort, QUERY_FIELDS.SORTABLE);

    //
    const result = await this.roomRepo.query.findManyPaginated({
      filter,
      page,
      limit,
      sort,
    });

    return {
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  /** */
  public async createRoom(theaterId: string, data: InputTypes.Create) {
    const { roomName, roomType, seatMap: seatMapRaw } = data;

    //
    const exists = await this.roomRepo.query.exists({
      filter: { theaterId, roomName },
    });
    if (exists) throw new ConflictException(`Room ${roomName} already exists`);

    //
    const result = await this.roomRepo.command.createOne({
      data: {
        theaterId: new Types.ObjectId(theaterId),
        roomName: roomName,
        roomType: roomType,
        seatMap: this.buildSeatMap(seatMapRaw),
      },
    });

    if (!result.insertedCount) throw new BadRequestException('Creation failed');
    return result.insertedItem;
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

  /** */
  public async updateRoomById(id: string, update: InputTypes.Update) {
    const { roomName, roomType, seatMap: seatMapRaw, isActive } = update;

    const existed = await this.roomRepo.query.findOneById({ id });
    if (!existed) throw new NotFoundException('Room not found');

    if (roomName && roomName !== existed.roomName) {
      const duplicated = await this.roomRepo.query.findOne({
        filter: {
          theaterId: new Types.ObjectId(existed.theaterId),
          roomName: roomName,
          _id: { $ne: existed._id },
        },
      });
      if (duplicated)
        throw new ConflictException(`Room [${roomName}] already exists`);
    }

    const seatMap = seatMapRaw ? this.buildSeatMap(seatMapRaw) : undefined;
    const result = await this.roomRepo.command.updateOneById({
      id,
      update: {
        roomName,
        roomType,
        seatMap,
        isActive,
      },
    });

    if (!result.matchedCount)
      throw new InternalServerErrorException('Update failed unexpectedly');
    return result.modifiedItem;
  }

  /** */
  public async deleteRoomById(id: string) {
    const exists = await this.roomRepo.query.exists({ filter: { _id: id } });
    if (!exists) throw new NotFoundException('Room not found');

    const result = await this.roomRepo.command.deleteOneById({ id });
    if (!result.deletedCount)
      throw new InternalServerErrorException('Deletion failed unexpectedly');

    // TODO: deactivate all showtime
  }
}
