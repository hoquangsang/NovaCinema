import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { SuccessResponse } from "src/common/responses";
import { SeatService } from "../services/seat.service";

@ApiTags('seats')
@Controller('seats')
export class SeatsController {
  constructor(
    private readonly service: SeatService
  ) {}

  @ApiOperation({ operationId: 'getSeatById' })
  @Get(':id')
  async getSeatById(
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    const result = await this.service.getSeatById(id);
    return SuccessResponse.of(result);
  }
  
  @ApiOperation({ operationId: 'getSeatsByRoomId' })
  @Get('')
  async getSeatsByRoomId(
    @Query('roomId', ParseObjectIdPipe) roomId: string
  ) {
    const result = await this.service.getSeatsByRoomId(roomId);
    return SuccessResponse.of(result);
  }
}
