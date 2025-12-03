import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { SuccessResponse } from "src/common/responses";
import { RoomService } from "../services/room.service";

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
    constructor(
        private readonly service: RoomService
    ) {}

    @ApiOperation({ operationId: 'getRoomById' })
    @Get(':id')
    async getRoomById(
        @Param('id', ParseObjectIdPipe) id: string
    ) {
        const result = await this.service.getRoomById(id);
        return SuccessResponse.of(result);
    }

    @ApiOperation({ operationId: 'getRoomsByTheaterId' })
    @Get('')
    async getRoomsByTheaterId(
        @Query('theaterId', ParseObjectIdPipe) theaterId: string
    ) {
        const result = await this.service.getRoomsByTheaterId(theaterId);
        return SuccessResponse.of(result);
    }
}