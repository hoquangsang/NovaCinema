import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Public, Roles, WrapListResponse, WrapNoContentResponse, WrapOkResponse, WrapPaginatedResponse } from "src/common/decorators";
import { TheaterService } from "../services/theater.service";
import {
  CreateTheaterRequestDto,
  PaginatedQueryTheatersRequestDto,
  QueryTheatersRequestDto,
  TheaterResponseDto,
  UpdateTheaterRequestDto
} from "../dtos";

@Public()/////////////////// for test
@ApiTags('Theaters')
@Controller('theaters')
export class TheatersController {
  constructor(
    private readonly theaterService: TheaterService
  ) {}

  @ApiOperation({ description: 'Query theaters' })
  @WrapPaginatedResponse({ dto: TheaterResponseDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  public async paginatedQueryTheaters(
    @Query() query: PaginatedQueryTheatersRequestDto
  ) {
    return this.theaterService.findTheatersPaginated(query);
  }

  @ApiOperation({ description: 'Query all theaters' })
  @WrapListResponse({ dto: TheaterResponseDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/list')
  public async queryTheaters(
    @Query() query: QueryTheatersRequestDto
  ) {
    return this.theaterService.findTheaters(query);
  }

  @ApiOperation({ description: 'Get theater by ID' })
  @WrapOkResponse({ dto: TheaterResponseDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  public async getById(
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    const existed = await this.theaterService.findTheaterById(id);
    if (!existed) throw new NotFoundException('Theater not found');
    return existed;
  }

  @ApiOperation({ description: 'Create new theater' })
  @WrapOkResponse({ dto: TheaterResponseDto, message: 'Created successfully' })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async createTheater(
    @Body() dto: CreateTheaterRequestDto
  ) {
    return this.theaterService.createTheater(dto);
  }

  @ApiOperation({ description: 'Update theater' })
  @WrapOkResponse({ dto: TheaterResponseDto, message: 'Updated successfully' })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  public async updateTheater(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateTheaterRequestDto
  ) {
    return this.theaterService.updateTheaterById(id, dto);
  }

  @ApiOperation({ description: 'Hard delete theater' })
  @WrapNoContentResponse({ message: 'Deleted successfully' })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteTheater(
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    await this.theaterService.deleteTheaterById(id);
  }
}