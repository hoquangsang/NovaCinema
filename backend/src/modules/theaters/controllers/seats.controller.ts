import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SeatService } from "../services/seat.service";

@ApiTags('seats')
@Controller('seats')
export class SeatsController {
  constructor(
    private readonly service: SeatService
  ) {}

  @ApiOperation({ operationId: 'getSeatById' })
  @Get(':id')
  getSeatById(
    @Param('id') id: string
  ) {
    return this.service.getSeatById(id);
  }
  
  @ApiOperation({ operationId: 'getSeatsByRoomId' })
  @Get('')
  getSeatsByRoomId(
    @Query('roomId') roomId: string
  ) {
    return this.service.getSeatsByRoomId(roomId);
  }
}
