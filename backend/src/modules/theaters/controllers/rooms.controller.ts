import { Controller, Get, HttpCode, NotFoundException, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { RoomService } from "../services/room.service";
import { WrapListResponse, WrapOkResponse } from "src/common/decorators";
import { RoomDto } from "../dtos";

@ApiTags('Theaters')
@Controller('rooms')
export class RoomsController {
  constructor(
      private readonly service: RoomService
  ) {}

  @ApiOperation({ description: 'get room by ID' })
  @WrapOkResponse({ dto: RoomDto })
  @HttpCode(200)
  @Get(':id')
  async getById(@Param('id', ParseObjectIdPipe) id: string) {
    const room = await this.service.findRoomById(id);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  @ApiOperation({ description: 'get rooms by theater ID' })
  @WrapListResponse({ dto: RoomDto })
  @HttpCode(200)
  @Get('theater/:theaterId')
  async getByTheaterId(@Param('theaterId', ParseObjectIdPipe) theaterId: string) {
    return this.service.getRoomsByTheaterId(theaterId);
  }
}