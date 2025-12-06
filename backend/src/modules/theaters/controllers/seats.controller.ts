import { Controller, Get, HttpCode, NotFoundException, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { SeatService } from "../services/seat.service";
import { WrapListResponse, WrapOkResponse } from "src/common/decorators";
import { SeatDto } from "../dtos";

@ApiTags('Theaters')
@Controller('seats')
export class SeatsController {
  constructor(
    private readonly service: SeatService
  ) {}
  
  @ApiOperation({ description: 'get seat by ID'})
  @WrapOkResponse({ dto: SeatDto })
  @HttpCode(200)
  @Get(':id')
  async getById(@Param('id', ParseObjectIdPipe) id: string) {
    const seat = await this.service.findSeatById(id);
    if (!seat) throw new NotFoundException('Seat not found');
    return seat;
  }

  @ApiOperation({ description: 'get seats by room ID'})
  @WrapListResponse({ dto: SeatDto })
  @HttpCode(200)
  @Get('room/:roomId')
  async getByRoomId(@Param('roomId', ParseObjectIdPipe) roomId: string) {
    return this.service.findSeatsByRoomId(roomId);
  }
}
