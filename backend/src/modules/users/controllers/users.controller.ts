import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CurrentUser, WrapOkResponse, WrapPaginatedResponse, Roles, WrapNoContentResponse, Public } from 'src/common/decorators';
import { UserService } from '../services/user.service';
import { PaginatedQueryUsersRequestDto, UpdateProfileRequestDto, UserResponseDto } from '../dtos';

@Public()/////////////////// for test
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @ApiOperation({ description: 'Get me' })
  @WrapOkResponse({ dto: UserResponseDto })
  @HttpCode(HttpStatus.OK)
  @Get('me')
  public async getMe(
    @CurrentUser() user: any
  ) {
    const existed = await this.userService.findUserById(user.sub);
    if (!existed) throw new NotFoundException('User not found');
    return existed;
  }
  
  @ApiOperation({ description: 'Update me' })
  @WrapOkResponse({ dto: UserResponseDto })
  @HttpCode(HttpStatus.OK)
  @Patch('me')
  public async updateMe(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileRequestDto
  ) {
    return await this.userService.updateUserById(user.sub, dto);
  }

  @ApiOperation({ description: 'Query users' })
  @WrapPaginatedResponse({ dto: UserResponseDto })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getUsers(
    @Query() query: PaginatedQueryUsersRequestDto
  ) {
    return this.userService.findUsersPaginated(query);
  }

  @ApiOperation({ description: 'Activate user' })
  @WrapNoContentResponse({ message: 'Activated successful' })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/activate')
  public async activateUser(
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    await this.userService.activateUserById(id);
  }

  @ApiOperation({ description: 'Deactivate user' })
  @WrapNoContentResponse({ message: 'Deactivated successful' })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/deactivate')
  public async deactivateUser(
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    await this.userService.deactivateUserById(id);
  }

  @ApiOperation({ description: 'Hard delete user' })
  @WrapNoContentResponse({ message: 'Deleted successfully' })
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteUser(
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    return await this.userService.deleteUserById(id);
  }
}