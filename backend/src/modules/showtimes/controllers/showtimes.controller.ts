import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import {
  Public,
  RequireRoles,
  WrapListResponse,
  WrapNoContentResponse,
  WrapOkResponse,
  WrapPaginatedResponse,
} from 'src/common/decorators';
import { USER_ROLES } from 'src/modules/users/constants';
import { ShowtimeService } from '../services/showtime.service';
import {
  CreateBulkShowtimesReqDto,
  CreateRepeatShowtimeReqDto,
  CreateShowtimeReqDto,
  DeleteShowtimeReqDto,
  PaginatedQueryRangeShowtimesReqDto,
  QueryAvailableShowtimesReqDto,
  QueryRangeShowtimesReqDto,
  QueryShowtimesByDateReqDto,
} from '../dtos/requests';
import {
  ShowtimeResDto,
  ShowtimeDetailResDto,
  CreateShowtimeValidationResDto,
} from '../dtos/responses';

@ApiTags('Showtimes')
@Controller('showtimes')
export class ShowtimesController {
  public constructor(private readonly showtimeService: ShowtimeService) {}

  @ApiOperation({ description: 'Paginated query range showtimes' })
  @WrapPaginatedResponse({ dto: ShowtimeResDto })
  @Public()
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getShowtimes(
    @Query() query: PaginatedQueryRangeShowtimesReqDto,
  ) {
    return await this.showtimeService.findShowtimesPaginated(query);
  }

  @ApiOperation({ description: 'Query range list showtimes' })
  @WrapListResponse({ dto: ShowtimeResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('/list')
  public async getListShowtimes(@Query() query: QueryRangeShowtimesReqDto) {
    return await this.showtimeService.findShowtimes(query);
  }

  @ApiOperation({ description: 'Query available showtimes (by date)' })
  @WrapListResponse({ dto: ShowtimeResDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/availability')
  public async getAvailableShowtimesByDate(
    @Query() query: QueryAvailableShowtimesReqDto,
  ) {
    return await this.showtimeService.findAvailableShowtimes(query);
  }

  @ApiOperation({ description: 'Get showtime by id' })
  @WrapOkResponse({ dto: ShowtimeDetailResDto })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  public async getShowtimeById(@Param('id', ParseObjectIdPipe) id: string) {
    const showtime = this.showtimeService.findShowtimeById(id);
    if (!showtime) throw new NotFoundException('Showtime not found');
    return showtime;
  }

  @ApiOperation({ description: 'Create showtime' })
  @WrapOkResponse({ dto: ShowtimeResDto })
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(USER_ROLES.ADMIN)
  @Post()
  public async createShowtime(@Body() dto: CreateShowtimeReqDto) {
    return await this.showtimeService.createSingleShowtime(dto);
  }

  @ApiOperation({ description: 'Create bulk showtimes' })
  @WrapListResponse({ dto: ShowtimeResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post('bulk')
  public async createBulkShowtimes(@Body() dto: CreateBulkShowtimesReqDto) {
    return await this.showtimeService.createBulkShowtimes(dto);
  }

  @ApiOperation({ description: 'Create repeated showtimes' })
  @WrapListResponse({ dto: ShowtimeResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post('repeated')
  public async createRepeatedShowtimes(
    @Body() dto: CreateRepeatShowtimeReqDto,
  ) {
    return await this.showtimeService.createRepeatedShowtimes(dto);
  }

  @ApiOperation({ description: 'Validate create showtime' })
  @WrapOkResponse({ dto: CreateShowtimeValidationResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Post('validate')
  public async validateCreate(@Body() dto: CreateShowtimeReqDto) {
    return await this.showtimeService.validateSingleCreation(dto);
  }

  @ApiOperation({ description: 'Validate bulk create showtimes' })
  @WrapOkResponse({ dto: CreateShowtimeValidationResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Post('validate/bulk')
  public async validateBulk(@Body() dto: CreateBulkShowtimesReqDto) {
    return await this.showtimeService.validateBulkCreation(dto);
  }

  @ApiOperation({ description: 'Validate repeated showtimes creation' })
  @WrapOkResponse({ dto: CreateShowtimeValidationResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Post('validate/repeated')
  public async validateRepeated(@Body() dto: CreateRepeatShowtimeReqDto) {
    return await this.showtimeService.validateRepeatedCreation(dto);
  }

  @ApiOperation({ description: 'Hard delete showtime by ID' })
  @WrapNoContentResponse()
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteShowtime(@Param('id', ParseObjectIdPipe) id: string) {
    await this.showtimeService.deleteShowtimeById(id);
  }

  @ApiOperation({ description: 'Hard delete showtimes' })
  @WrapNoContentResponse()
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  public async deleteShowtimes(@Body() dto: DeleteShowtimeReqDto) {
    return await this.showtimeService.deleteShowtimes(dto);
  }
}
