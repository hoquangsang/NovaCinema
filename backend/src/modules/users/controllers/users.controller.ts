import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SortUtil } from 'src/common/utils';
import { CurrentUser, WrapOkResponse, WrapPaginatedResponse, Roles, WrapNoContentResponse } from 'src/common/decorators';
import { UserService } from '../services/user.service';
import { UpdateUserDto, QueryUsersDto, UpdateProfileDto, UserDto } from '../dtos';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService
  ) {}

  @ApiOperation({ description: 'get me' })
  @WrapOkResponse({ dto: UserDto })
  @HttpCode(200)
  @Get('me')
  async getMe(
    @CurrentUser() user: any
  ) {
    return await this.usersService.findById(user.sub);
  }
  
  @ApiOperation({ description: 'update me' })
  @WrapOkResponse({ dto: UserDto })
  @HttpCode(200)
  @Patch('me')
  async updateMe(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto
  ) {
    return await this.usersService.updateById(user.sub, dto);
  }

  @ApiOperation({ description: 'find paginated users' })
  @WrapPaginatedResponse({ dto: UserDto })
  @Roles('admin')
  @HttpCode(200)
  @Get()
  async findPaginated(
    @Query() q: QueryUsersDto
  ) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 10;
    const sort = SortUtil.parse(q.sort);

    const result = await this.usersService.findPaginated({
      search: q.search,
      sort,
      page,
      limit,
    });

    return {
      items: result.items,
      total: result.total,
      page,
      limit,
    };
  }

  @ApiOperation({ description: 'admin update user' })
  @WrapOkResponse({ dto: UserDto })
  @Roles('admin')
  @HttpCode(200)
  @Patch(':id')
  async adminUpdate(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateUserDto
  ) {
    return await this.usersService.updateById(id, dto);
  }

  @ApiOperation({ description: 'admin delete user' })
  @WrapNoContentResponse({ message: 'User deleted successfully' })
  @Roles('admin')
  @HttpCode(204)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    return await this.usersService.deleteById(id);
  }
}