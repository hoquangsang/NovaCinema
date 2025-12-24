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
import { TicketPricingService } from '../services';
import { UpsertTicketPricingReqDto } from '../dtos/requests';
import { TicketPricingResDto } from '../dtos/responses';

@ApiTags('Ticket pricing')
@Controller('ticket-pricing')
export class TicketPricingController {
  constructor(private readonly pricingService: TicketPricingService) {}

  @ApiOperation({ description: 'Get current ticket pricing' })
  @WrapOkResponse({ dto: TicketPricingResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getTicketPricing() {
    return await this.pricingService.getTicketPricing();
  }

  @ApiOperation({ description: 'Create or update ticket pricing' })
  @WrapOkResponse({ dto: TicketPricingResDto })
  @RequireRoles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put()
  public async upsertTicketPricing(@Body() dto: UpsertTicketPricingReqDto) {
    return await this.pricingService.upsertTicketPricing(dto);
  }
}
