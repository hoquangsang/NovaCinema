import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { TheaterService } from "../services/theater.service";
import { Public, WrapListResponse, WrapNoContentResponse, WrapOkResponse } from "src/common/decorators";
import { CreateTheaterDto, TheaterDto, UpdateTheaterDto } from "../dtos";

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
  @Public()
  @HttpCode(200)
  @Get()
  async getAll() {
    return this.service.findAllTheaters();
  }

  @ApiOperation({ description: 'Create new theater' })
  @WrapOkResponse({ dto: TheaterDto })
  @HttpCode(201)
  @Post()
  async createTheater(@Body() dto: CreateTheaterDto) {
    return this.service.createTheater(dto);
  }

  @ApiOperation({ description: 'Update theater' })
  @WrapOkResponse({ dto: TheaterDto })
  @HttpCode(200)
  @Patch(':id')
  async updateTheater(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateTheaterDto
  ) {
    const theater = await this.service.updateById(id, dto);
    if (!theater) throw new NotFoundException('Theater not found');
    return theater;
  }

  @ApiOperation({ description: 'Delete theater' })
  @WrapNoContentResponse({ message: 'Theater deleted successfully' })
  @HttpCode(204)
  @Delete(':id')
  async deleteTheater(@Param('id', ParseObjectIdPipe) id: string) {
    const deleted = await this.service.deleteById(id);
    if (!deleted) throw new NotFoundException('Theater not found');
  }
}