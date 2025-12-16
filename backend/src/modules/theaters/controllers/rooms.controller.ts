import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Public, Roles, WrapCreatedResponse, WrapListResponse, WrapNoContentResponse, WrapOkResponse, WrapPaginatedResponse } from "src/common/decorators";
import { RoomService } from "../services/room.service";
import { CreateRoomRequestDto, PaginatedQueryRoomsRequestDto, QueryRoomsRequestDto, RoomResponseDto, UpdateRoomRequestDto } from "../dtos";

@ApiTags('Theaters')
@Controller('rooms')
export class RoomsController {
  constructor(
      private readonly roomService: RoomService
  ) {}

  @ApiOperation({ description: 'Get room by ID' })
  @WrapOkResponse({ dto: RoomResponseDto })
  @Public()/////////////////// for test
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  public async getById(
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    const existed = await this.roomService.findRoomById(id);
    if (!existed) throw new NotFoundException('Room not found');
    return existed;
  }

  @ApiOperation({ description: 'Query rooms by theater ID' })
  @WrapPaginatedResponse({ dto: RoomResponseDto })
  @Public()/////////////////// for test
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Get('theater/:theaterId')
  public async getRoomsByTheaterId(
    @Param('theaterId', ParseObjectIdPipe) theaterId: string,
    @Query() query: PaginatedQueryRoomsRequestDto
  ) {
    return this.roomService.findRoomsPaginatedByTheaterId(theaterId, query);
  }

  @ApiOperation({ description: 'Query all rooms by theater ID' })
  @WrapListResponse({ dto: RoomResponseDto })
  @Public()/////////////////// for test
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Get('theater/:theaterId/list')
  public async getAllRoomsByTheaterId(
    @Param('theaterId', ParseObjectIdPipe) theaterId: string,
    @Query() query: QueryRoomsRequestDto
  ) {
    return this.roomService.findRoomsByTheaterId(theaterId, query);
  }

  @ApiOperation({ description: 'Create room' })
  @WrapCreatedResponse({ dto: RoomResponseDto, message: 'Created successfully' })
  @Public()/////////////////// for test
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post('/theaters/:theaterId')
  public async createRoom(
    @Param('theaterId', ParseObjectIdPipe) theaterId: string,
    @Body() dto: CreateRoomRequestDto
  ) {
    return this.roomService.createRoom(theaterId, dto);
  }
  
  @ApiOperation({ description: 'Update room by Id' })
  @WrapOkResponse({ dto: RoomResponseDto })
  @Public()/////////////////// for test
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  public async updateRoom(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateRoomRequestDto
  ) {
    return this.roomService.updateRoomById(id, dto);
  }

  @ApiOperation({ description: 'Hard delete room by ID' })
  @WrapNoContentResponse({ message: 'Deleted successfully' })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteRoomById(@Param('id', ParseObjectIdPipe) id: string) {
    await this.roomService.deleteRoomById(id);
  }
}
