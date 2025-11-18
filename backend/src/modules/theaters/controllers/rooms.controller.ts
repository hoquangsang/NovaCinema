import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoomService } from "../services/room.service";

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
    constructor(
        private readonly service: RoomService
    ) {}

    @ApiOperation({ operationId: 'getRoomById' })
    @Get(':id')
    getRoomById(
        @Param('id') id: string
    ) {
        return this.service.getRoomById(id);
    }

    @ApiOperation({ operationId: 'getRoomsByTheaterId' })
    @Get('')
    getRoomsByTheaterId(
        @Query('theaterId') theaterId: string
    ) {
        return this.service.getRoomsByTheaterId(theaterId);
    }
}