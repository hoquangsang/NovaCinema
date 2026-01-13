import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireRoles, WrapOkResponse } from 'src/common/decorators';
import { USER_ROLES } from 'src/modules/users/constants';
import { DashboardService } from '../services';
import { DashboardStatsResDto, RecentActivityResDto } from '../dtos';

@ApiTags('Dashboard')
@Controller('dashboard')
export class AdminDashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ description: 'Get dashboard statistics' })
  @WrapOkResponse({ dto: DashboardStatsResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('statistics')
  public async getStatistics() {
    return await this.dashboardService.getStatistics();
  }

  @ApiOperation({ description: 'Get recent activity' })
  @WrapOkResponse({ dto: RecentActivityResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('recent-activity')
  public async getRecentActivity(@Query('limit') limit?: string) {
    const activities = await this.dashboardService.getRecentActivity(
      limit ? parseInt(limit, 10) : 10,
    );
    return { activities };
  }
}
