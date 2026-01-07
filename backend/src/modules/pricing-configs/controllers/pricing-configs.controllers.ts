import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireRoles, WrapOkResponse } from 'src/common/decorators';
import { USER_ROLES } from 'src/modules/users/constants';
import { PricingConfigService } from '../services';
import {
  CreatePricingConfigReqDto,
  UpdatePricingConfigReqDto,
} from '../dtos/requests';
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

  @ApiOperation({ description: 'Create pricing config' })
  @WrapOkResponse({ dto: PricingConfigResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Post()
  public async createPricingConfig(@Body() dto: CreatePricingConfigReqDto) {
    return await this.pricingService.createPricingConfig(dto);
  }

  @ApiOperation({ description: 'Update pricing config' })
  @WrapOkResponse({ dto: PricingConfigResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Patch()
  public async updatePricingConfig(@Body() dto: UpdatePricingConfigReqDto) {
    return await this.pricingService.updatePricingConfig(dto);
  }
}
