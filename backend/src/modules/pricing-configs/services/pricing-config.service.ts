import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DayOfWeek } from 'src/common/types';
import { WeekUtil } from 'src/common/utils';
import { SEAT_TYPE_VALUES } from 'src/modules/theaters/constants';
import { SeatType, RoomType } from 'src/modules/theaters/types';
import { PRICING_LIMITS } from '../constants';
import { PricingConfig, PricingModifiers } from '../schemas';
import { PricingConfigRepository } from '../repositories';
import { PricingConfigCriteria as Criteria } from './pricing-config.service.type';
import { PricingConfigResult as Result } from './pricing-config.service.type';

@Injectable()
export class PricingConfigService {
  public constructor(private readonly pricingRepo: PricingConfigRepository) {}

  public async findPricingConfig() {
    return this.pricingRepo.query.findOne({ filter: {} });
  }

  public async getPricingConfig() {
    const pricing = await this.findPricingConfig();
    if (!pricing)
      throw new NotFoundException('Pricing configuration is not set');
    return pricing;
  }

  public async getSeatTypePrices(
    input: Criteria.SeatTypePrices,
  ): Promise<Result.SeatTypePrices> {
    const { roomType, effectiveAt } = input;

    const {
      basePrice,
      modifiers: { seatTypes, roomTypes, daysOfWeek },
    } = await this.getPricingConfig();

    const roomDelta =
      roomTypes.find(({ roomType: rt }) => rt === roomType)?.deltaPrice ?? 0;

    const dayOfWeek = WeekUtil.dayOfWeek(effectiveAt);
    const dayDelta =
      daysOfWeek.find(({ dayOfWeek: d }) => d === dayOfWeek)?.deltaPrice ?? 0;

    const nonSeatPrice = basePrice + roomDelta + dayDelta;

    return Object.fromEntries(
      SEAT_TYPE_VALUES.map((seatType) => {
        const seatDelta =
          seatTypes.find(({ seatType: st }) => st === seatType)?.deltaPrice ??
          0;

        const rawPrice = nonSeatPrice + seatDelta;
        return [seatType, this.clampTotalPrice(rawPrice)];
      }),
    ) as Record<SeatType, number>;
  }

  public async createPricingConfig(data: Criteria.Create) {
    const existing = await this.findPricingConfig();
    if (existing)
      throw new BadRequestException('Pricing configuration already exists');

    const { basePrice, modifiers } = data;

    this.validatePricingInput(basePrice, modifiers);
    const pricing: PricingConfig = {
      basePrice,
      modifiers: this.normalizeModifiers(modifiers),
    };

    const { insertedItem } = await this.pricingRepo.command.createOne({
      data: pricing,
    });

    return insertedItem;
  }

  public async updatePricingConfig(data: Criteria.Update) {
    if (data.basePrice === undefined && !data.modifiers)
      throw new BadRequestException('Nothing to update');

    const existing = await this.getPricingConfig();

    const basePrice = data.basePrice ?? existing.basePrice;
    const modifiers = data.modifiers ?? existing.modifiers;

    this.validatePricingInput(basePrice, modifiers);

    const { modifiedItem } = await this.pricingRepo.command.updateOne({
      filter: {},
      update: {
        basePrice,
        modifiers: this.normalizeModifiers(modifiers),
      },
    });

    return modifiedItem;
  }

  private validatePricingInput(
    basePrice: number,
    modifiers?: Criteria.PricingModifiers,
  ) {
    this.validateBasePrice(basePrice);
    this.validateModifiers(modifiers);
    this.validateTotalPrice(basePrice, modifiers);
  }

  private validateBasePrice(basePrice: number) {
    const { MIN, MAX } = PRICING_LIMITS.BASE_PRICE;
    if (basePrice < MIN || basePrice > MAX)
      throw new BadRequestException(
        `basePrice must be between ${MIN} and ${MAX}`,
      );
  }

  private validateModifiers(modifiers?: Criteria.PricingModifiers) {
    if (!modifiers) return;

    const { seatTypes, roomTypes, daysOfWeek } = modifiers;

    if (seatTypes) this.validateSeatTypeModifiers(seatTypes);
    if (roomTypes) this.validateRoomTypeModifiers(roomTypes);
    if (daysOfWeek) this.validateDayOfWeekModifiers(daysOfWeek);
  }

  private validateSeatTypeModifiers(arr: Criteria.SeatTypeModifier[]) {
    const used = new Set<SeatType>();

    for (const { seatType, deltaPrice } of arr) {
      if (used.has(seatType))
        throw new BadRequestException(`Duplicate seatType [${seatType}]`);

      this.validateDeltaPrice(deltaPrice);
      used.add(seatType);
    }
  }

  private validateRoomTypeModifiers(arr: Criteria.RoomTypeModifier[]) {
    const used = new Set<RoomType>();

    for (const { roomType, deltaPrice } of arr) {
      if (used.has(roomType))
        throw new BadRequestException(`Duplicate roomType [${roomType}]`);

      this.validateDeltaPrice(deltaPrice);
      used.add(roomType);
    }
  }

  private validateDayOfWeekModifiers(arr: Criteria.DayOfWeekModifier[]) {
    const used = new Set<DayOfWeek>();

    for (const { dayOfWeek, deltaPrice } of arr) {
      if (used.has(dayOfWeek))
        throw new BadRequestException(`Duplicate dayOfWeek [${dayOfWeek}]`);

      this.validateDeltaPrice(deltaPrice);
      used.add(dayOfWeek);
    }
  }

  private validateDeltaPrice(deltaPrice: number) {
    const { MIN_DELTA, MAX_DELTA } = PRICING_LIMITS.PRICING_MODIFIER;
    if (deltaPrice < MIN_DELTA || deltaPrice > MAX_DELTA)
      throw new BadRequestException(
        `deltaPrice must be between ${MIN_DELTA} and ${MAX_DELTA}`,
      );
  }

  private validateTotalPrice(
    basePrice: number,
    modifiers?: Criteria.PricingModifiers,
  ) {
    const { seatTypes = [], roomTypes = [], daysOfWeek = [] } = modifiers ?? {};

    const seatDeltas = seatTypes.map(({ deltaPrice }) => deltaPrice);
    const roomDeltas = roomTypes.map(({ deltaPrice }) => deltaPrice);
    const dayDeltas = daysOfWeek.map(({ deltaPrice }) => deltaPrice);

    const worst =
      basePrice +
      Math.max(0, ...seatDeltas) +
      Math.max(0, ...roomDeltas) +
      Math.max(0, ...dayDeltas);

    const best =
      basePrice +
      Math.min(0, ...seatDeltas) +
      Math.min(0, ...roomDeltas) +
      Math.min(0, ...dayDeltas);

    const { MIN, MAX } = PRICING_LIMITS.TOTAL_PRICE;

    if (worst > MAX || best < MIN)
      throw new BadRequestException(
        `Total price may exceed allowed range (${MIN} - ${MAX})`,
      );
  }

  private normalizeModifiers(
    modifiers?: Criteria.PricingModifiers,
  ): PricingModifiers {
    const { seatTypes, roomTypes, daysOfWeek } = modifiers ?? {};
    return {
      seatTypes: seatTypes ?? [],
      roomTypes: roomTypes ?? [],
      daysOfWeek: daysOfWeek ?? [],
    };
  }

  private clampTotalPrice(price: number) {
    const { MIN, MAX } = PRICING_LIMITS.TOTAL_PRICE;
    return Math.max(MIN, Math.min(MAX, price));
  }
}
