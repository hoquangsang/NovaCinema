import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { RoomService } from "../services/room.service";
import { WrapCreatedResponse, WrapListResponse, WrapNoContentResponse, WrapOkResponse } from "src/common/decorators";
import { CreateRoomDto, RoomDto, UpdateRoomDto } from "../dtos";

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

  @ApiOperation({ description: 'add room to a theater' })
  @WrapCreatedResponse({ dto: RoomDto, message: 'Room created successfully' })
  @HttpCode(201)
  @Post()
  async createRoom(@Body() dto: CreateRoomDto) {
    return this.service.addRoomToTheater(dto);
  }
  
  @ApiOperation({ description: 'Update room' })
  @WrapOkResponse({ dto: RoomDto })
  @HttpCode(200)
  @Patch(':id')
  async updateRoom(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateRoomDto
  ) {
    const room = await this.service.updateById(id, dto);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  @ApiOperation({ description: 'Delete room' })
  @WrapNoContentResponse({ message: 'Room deleted successfully' })
  @HttpCode(204)
  @Delete(':id')
  async deleteRoom(@Param('id', ParseObjectIdPipe) id: string) {
    await this.service.deleteById(id);
  }
}