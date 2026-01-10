import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import {
  RequireRoles,
  WrapCreatedResponse,
  WrapListResponse,
  WrapNoContentResponse,
  WrapOkResponse,
  WrapPaginatedResponse,
} from 'src/common/decorators';
import { USER_ROLES } from 'src/modules/users/constants';
import { RoomService } from '../services';
import {
  CreateRoomReqDto,
  PaginatedQueryRoomsReqDto,
  QueryRoomsReqDto,
  UpdateRoomReqDto,
} from '../dtos/requests';
import { RoomDetailResDto, RoomResDto } from '../dtos/responses';

@ApiTags('Theaters')
@Controller()
export class RoomsController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ description: 'Get room by ID' })
  @WrapOkResponse({ dto: RoomDetailResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('rooms/:id')
  public async getById(@Param('id', ParseObjectIdPipe) id: string) {
    const existed = await this.roomService.findRoomById(id);
    if (!existed) throw new NotFoundException('Room not found');
    return existed;
  }

  @ApiOperation({ description: 'Query rooms by theater ID' })
  @WrapPaginatedResponse({ dto: RoomResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('theaters/:theaterId/rooms')
  public async getRoomsByTheaterId(
    @Param('theaterId', ParseObjectIdPipe) theaterId: string,
    @Query() query: PaginatedQueryRoomsReqDto,
  ) {
    return this.roomService.findRoomsPaginatedByTheaterId(theaterId, query);
  }

  @ApiOperation({ description: 'Query all rooms by theater ID' })
  @WrapListResponse({ dto: RoomResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('theaters/:theaterId/rooms/list')
  public async getAllRoomsByTheaterId(
    @Param('theaterId', ParseObjectIdPipe) theaterId: string,
    @Query() query: QueryRoomsReqDto,
  ) {
    return this.roomService.findRoomsByTheaterId(theaterId, query);
  }

  @ApiOperation({ description: 'Create room' })
  @WrapCreatedResponse({ dto: RoomDetailResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post('/theaters/:theaterId/rooms')
  public async createRoom(
    @Param('theaterId', ParseObjectIdPipe) theaterId: string,
    @Body() dto: CreateRoomReqDto,
  ) {
    return this.roomService.createRoom(theaterId, dto);
  }

  @ApiOperation({ description: 'Update room by Id' })
  @WrapOkResponse({ dto: RoomDetailResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Patch('rooms/:id')
  public async updateRoom(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateRoomReqDto,
  ) {
    return this.roomService.updateRoomById(id, dto);
  }

  @ApiOperation({ description: 'Hard delete room by ID' })
  @WrapNoContentResponse({ message: 'Deleted successfully' })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('rooms/:id')
  public async deleteRoomById(@Param('id', ParseObjectIdPipe) id: string) {
    await this.roomService.deleteRoomById(id);
  }
}
