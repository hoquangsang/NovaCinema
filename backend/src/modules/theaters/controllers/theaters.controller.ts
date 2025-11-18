import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TheaterService } from "../services/theater.service";

@ApiTags('theaters')
@Controller('theaters')
export class TheatersController {
  constructor(
    private readonly service: TheaterService
    ) {}

    @ApiOperation({ operationId: 'getTheaterById' })
    @Get(':id')
    getTheaterById(@Param('id') id: string) {
        return this.service.getTheaterById(id);
    }

    @ApiOperation({ operationId: 'getAllTheaters' })
    @Get()
    getAllTheaters() {
        return this.service.getAllTheaters();
    }
}