import { Controller, Get, HttpCode, NotFoundException, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { TheaterService } from "../services/theater.service";
import { WrapListResponse, WrapOkResponse } from "src/common/decorators";
import { TheaterDto } from "../dtos";

@ApiTags('Theaters')
@Controller('theaters')
export class TheatersController {
  constructor(
    private readonly service: TheaterService
  ) {}
  
  @ApiOperation({ description: 'Get theater by ID' })
  @WrapOkResponse({ dto: TheaterDto })
  @HttpCode(200)
  @Get(':id')
  async getById(@Param('id', ParseObjectIdPipe) id: string) {
    const theater = await this.service.findTheaterById(id);
    if (!theater) throw new NotFoundException('Theater not found');
    return theater;
  }

  @ApiOperation({ description: 'Get all theaters' })
  @WrapListResponse({ dto: TheaterDto })
  @HttpCode(200)
  @Get()
  async getAll() {
    return this.service.getAllTheaters();
  }
}