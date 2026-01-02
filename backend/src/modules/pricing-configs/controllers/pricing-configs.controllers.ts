import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireRoles, WrapOkResponse } from 'src/common/decorators';
import { USER_ROLES } from 'src/modules/users/constants';
import { PricingConfigService } from '../services';
import { UpsertPricingConfigReqDto } from '../dtos/requests';
import { PricingConfigResDto } from '../dtos/responses';

@ApiTags('Pricing configuration')
@Controller('pricing-configs')
export class PricingConfigController {
  constructor(private readonly pricingService: PricingConfigService) {}

  @ApiOperation({ description: 'Get current pricing config' })
  @WrapOkResponse({ dto: PricingConfigResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getPricingConfig() {
    return await this.pricingService.getPricingConfig();
  }

  @ApiOperation({ description: 'Create or update pricing config' })
  @WrapOkResponse({ dto: PricingConfigResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put()
  public async upsertPricingConfig(@Body() dto: UpsertPricingConfigReqDto) {
    return await this.pricingService.upsertPricingConfig(dto);
  }
}
