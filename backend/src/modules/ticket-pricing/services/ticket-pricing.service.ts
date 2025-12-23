import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DaysOfWeek, TimeHHmm } from 'src/common/types';
import { CalendarUtil, DateUtil, TimeUtil } from 'src/common/utils';
import { SeatType, RoomType } from 'src/modules/theaters/types';
import { PRICING_LIMITS } from '../constants';
import { TicketPricingRepository } from '../repositories';
import { TicketPricing } from '../schemas';
import { TicketPricingCriteria as Criteria } from './ticket-pricing.service.type';

@Injectable()
export class TicketPricingService {
  public constructor(private readonly pricingRepo: TicketPricingRepository) {}

  public async getTicketPricing() {
    // TicketPricing is a singleton document
    const pricing = await this.pricingRepo.query.findOne({ filter: {} });
    if (!pricing)
      throw new NotFoundException('Ticket pricing configuration is not set');
    return pricing;
  }

  public async getTicketPrice(input: Criteria.Calculate) {
    const pricing = await this.getTicketPricing();

    const raw = this.calculatePrice(pricing, input);

    return Math.max(
      PRICING_LIMITS.TOTAL_PRICE.MIN,
      Math.min(PRICING_LIMITS.TOTAL_PRICE.MAX, raw),
    );
  }

  public async upsertTicketPricing(data: Criteria.Upsert) {
    this.assertUpsertInputValid(data);
    const { basePrice: nextBasePrice, modifiers: nextModifiers } = data;

    const existingPricing = await this.pricingRepo.query.findOne({
      filter: {},
    });
    if (!existingPricing && nextBasePrice === undefined)
      throw new BadRequestException(
        'Base price is required when initializing ticket pricing',
      );

    const currentBasePrice =
      existingPricing?.basePrice ?? PRICING_LIMITS.BASE_PRICE.MIN;
    const currentModifiers = existingPricing?.modifiers;

    const updatedBasePrice = nextBasePrice ?? currentBasePrice;
    const updatedModifiers = {
      seatTypes: nextModifiers?.seatTypes ?? currentModifiers?.seatTypes ?? [],
      roomTypes: nextModifiers?.roomTypes ?? currentModifiers?.roomTypes ?? [],
      daysOfWeek:
        nextModifiers?.daysOfWeek ?? currentModifiers?.daysOfWeek ?? [],
      dailyTimeRanges:
        nextModifiers?.dailyTimeRanges ??
        currentModifiers?.dailyTimeRanges ??
        [],
    };
    const updatedPricing = {
      basePrice: updatedBasePrice,
      modifiers: updatedModifiers,
    };
    this.assertTotalPriceWithinLimit(updatedPricing);

    const { upsertedItem: upsertedPricing } =
      await this.pricingRepo.command.upsertOne({
        filter: {},
        update: updatedPricing,
      });

    return upsertedPricing;
  }

  /** */
  private calculatePrice(
    pricing: TicketPricing,
    input: Criteria.Calculate,
  ): number {
    const { roomType, seatType, datetime } = input;
    const { basePrice, modifiers } = pricing;

    const currentDayOfWeek = CalendarUtil.dayOfWeek(datetime);
    const minuteOfDay = DateUtil.localMinutesOfDay(datetime);

    const seatTypeModifier = modifiers.seatTypes.find(
      (x) => x.seatType === seatType,
    );
    const roomTypeModifier = modifiers.roomTypes.find(
      (x) => x.roomType === roomType,
    );
    const dayOfWeekModifier = modifiers.daysOfWeek.find((x) =>
      x.applicableDays.includes(currentDayOfWeek),
    );
    const dailyTimeRangeModifier = modifiers.dailyTimeRanges.find((x) =>
      this.matchTimeRange(minuteOfDay, x.startTime, x.endTime),
    );

    const deltas = [
      seatTypeModifier?.deltaPrice ?? 0,
      roomTypeModifier?.deltaPrice ?? 0,
      dayOfWeekModifier?.deltaPrice ?? 0,
      dailyTimeRangeModifier?.deltaPrice ?? 0,
    ];
    const totalDelta = deltas.reduce((sum, d) => sum + d, 0);

    return basePrice + totalDelta;
  }

  private matchTimeRange(time: number, startTime: TimeHHmm, endTime: TimeHHmm) {
    const start = TimeUtil.toMinutes(startTime);
    const end = TimeUtil.toMinutes(endTime);

    return start <= end
      ? time >= start && time < end
      : time >= start || time < end;
  }

  private assertUpsertInputValid(data: Criteria.Upsert) {
    const { basePrice, modifiers } = data;
    if (basePrice === undefined && !modifiers)
      throw new BadRequestException('Nothing to update');

    if (basePrice !== undefined) this.assertBasePriceValid(basePrice);
    if (modifiers) this.assertPricingModifiersValid(modifiers);
  }

  private assertBasePriceValid(basePrice: number) {
    const { MIN, MAX } = PRICING_LIMITS.BASE_PRICE;
    if (basePrice < MIN || basePrice > MAX) {
      throw new BadRequestException(
        `basePrice must be between ${MIN} and ${MAX}`,
      );
    }
  }

  private assertPricingModifiersValid(modifiers: Criteria.PricingModifier) {
    if (modifiers.seatTypes)
      this.assertSeatTypeModifiersValid(modifiers.seatTypes);
    if (modifiers.roomTypes)
      this.validateRoomTypeModifiersValid(modifiers.roomTypes);
    if (modifiers.daysOfWeek)
      this.assertDayOfWeekModifiersValid(modifiers.daysOfWeek);
    if (modifiers.dailyTimeRanges)
      this.assertDailyTimeRangeModifiersValid(modifiers.dailyTimeRanges);
  }

  private assertDeltaPriceValid(delta: number) {
    const { MIN_DELTA, MAX_DELTA } = PRICING_LIMITS.PRICING_MODIFIER;
    if (delta < MIN_DELTA || delta > MAX_DELTA) {
      throw new BadRequestException(
        `deltaPrice must be between ${MIN_DELTA} and ${MAX_DELTA}`,
      );
    }
  }

  private assertSeatTypeModifiersValid(arr: Criteria.SeatTypeModifiers[]) {
    const used = new Set<SeatType>();
    for (const m of arr) {
      if (used.has(m.seatType))
        throw new BadRequestException(`Duplicate seatType [${m.seatType}]`);
      this.assertDeltaPriceValid(m.deltaPrice);
      used.add(m.seatType);
    }
  }

  private validateRoomTypeModifiersValid(arr: Criteria.RoomTypeModifiers[]) {
    const used = new Set<RoomType>();
    for (const m of arr) {
      if (used.has(m.roomType))
        throw new BadRequestException(`Duplicate roomType [${m.roomType}]`);
      this.assertDeltaPriceValid(m.deltaPrice);
      used.add(m.roomType);
    }
  }

  private assertDayOfWeekModifiersValid(arr: Criteria.DaysOfWeekModifiers[]) {
    const used = new Set<DaysOfWeek>();
    for (const m of arr) {
      this.assertDeltaPriceValid(m.deltaPrice);
      for (const d of m.applicableDays) {
        if (used.has(d)) throw new BadRequestException(`Duplicate day [${d}]`);
        used.add(d);
      }
    }
  }

  private assertDailyTimeRangeModifiersValid(
    arr: Criteria.DailyTimeRangeModifiers[],
  ) {
    const ranges: { start: number; end: number; original: string }[] = [];

    for (const m of arr) {
      if (!TimeUtil.isValidHHmm(m.startTime)) {
        throw new BadRequestException(`Invalid startTime [${m.startTime}]`);
      }

      if (!TimeUtil.isValidHHmm(m.endTime)) {
        throw new BadRequestException(`Invalid endTime [${m.endTime}]`);
      }

      const startTime = TimeUtil.roundDown(m.startTime);
      const endTime = TimeUtil.roundUp(m.endTime);

      if (startTime === endTime) {
        throw new BadRequestException(
          `Invalid time range [${startTime}] - [${endTime}]`,
        );
      }

      this.assertDeltaPriceValid(m.deltaPrice);

      const start = TimeUtil.toMinutes(startTime);
      const end = TimeUtil.toMinutes(endTime);

      // normalize
      if (start < end) {
        ranges.push({ start, end, original: `${startTime}-${endTime}` });
      } else {
        ranges.push({
          start,
          end: 24 * 60,
          original: `${startTime}-${endTime}`,
        });
        ranges.push({ start: 0, end, original: `${startTime}-${endTime}` });
      }
    }

    ranges.sort((a, b) => a.start - b.start);

    // check overlap
    for (let i = 1; i < ranges.length; i++) {
      const prev = ranges[i - 1];
      const cur = ranges[i];

      if (cur.start < prev.end) {
        throw new BadRequestException(
          `Overlapping daily time ranges: [${prev.original}] overlaps with [${cur.original}]`,
        );
      }
    }
  }

  private assertTotalPriceWithinLimit(pricing: TicketPricing) {
    const seatDeltas = pricing.modifiers.seatTypes.map((x) => x.deltaPrice);
    const roomDeltas = pricing.modifiers.roomTypes.map((x) => x.deltaPrice);
    const dayDeltas = pricing.modifiers.daysOfWeek.map((x) => x.deltaPrice);
    const timeDeltas = pricing.modifiers.dailyTimeRanges.map(
      (x) => x.deltaPrice,
    );

    const worst =
      pricing.basePrice +
      Math.max(0, ...seatDeltas) +
      Math.max(0, ...roomDeltas) +
      Math.max(0, ...dayDeltas) +
      Math.max(0, ...timeDeltas);

    const best =
      pricing.basePrice +
      Math.min(0, ...seatDeltas) +
      Math.min(0, ...roomDeltas) +
      Math.min(0, ...dayDeltas) +
      Math.min(0, ...timeDeltas);

    const { MIN, MAX } = PRICING_LIMITS.TOTAL_PRICE;

    if (worst > MAX || best < MIN) {
      throw new BadRequestException(
        `Total price may exceed allowed range (${MIN} - ${MAX})`,
      );
    }
  }
}
