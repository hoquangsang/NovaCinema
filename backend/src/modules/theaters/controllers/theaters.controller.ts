import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { SuccessResponse } from "src/common/responses";
import { TheaterService } from "../services/theater.service";

@ApiTags('theaters')
@Controller('theaters')
export class TheatersController {
  constructor(
    private readonly service: TheaterService
    ) {}

    @ApiOperation({ operationId: 'getTheaterById' })
    @Get(':id')
    async getTheaterById(
        @Param('id', ParseObjectIdPipe) id: string
    ) {
        const result = await this.service.getTheaterById(id);
        return SuccessResponse.of(result);
    }

    @ApiOperation({ operationId: 'getAllTheaters' })
    @Get()
    async getAllTheaters() {
        const result = await this.service.getAllTheaters();
        return SuccessResponse.of(result);
    }
}