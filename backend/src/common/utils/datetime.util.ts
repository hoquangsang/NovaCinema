import { TIMEZONE_OFFSET } from '../constants';
import {
  DAYS_OF_WEEK_ORDER,
  DAYS_OF_WEEK_VALUES,
  DaysOfWeek,
  TIME_HH_MM_REGEX,
  TimeHHmm,
} from '../types';

/** */
const TZ_MS = TIMEZONE_OFFSET * 60_000;

/** */
export const LOCAL_DATETIME_FORMATS = [
  'yyyy-MM-dd HH:mm:ss.SSS',
  'yyyy-MM-dd HH:mm:ss',
  'yyyy-MM-dd HH:mm',
  'yyyy-MM-dd',

  'dd-MM-yyyy HH:mm:ss.SSS',
  'dd-MM-yyyy HH:mm:ss',
  'dd-MM-yyyy HH:mm',
  'dd-MM-yyyy',

  'yyyy/MM/dd HH:mm:ss.SSS',
  'yyyy/MM/dd HH:mm:ss',
  'yyyy/MM/dd HH:mm',
  'yyyy/MM/dd',

  'dd/MM/yyyy HH:mm:ss.SSS',
  'dd/MM/yyyy HH:mm:ss',
  'dd/MM/yyyy HH:mm',
  'dd/MM/yyyy',
] as const;

/** */
export type LocalDatetimeFormat = (typeof LOCAL_DATETIME_FORMATS)[number];

/** */
export const DateUtil = {
  /* ========= NOW ========= */
  nowUtc(): Date {
    return new Date();
  },

  nowLocal(): Date {
    return new Date(Date.now() + TZ_MS);
  },

  /* ========= OPS ========= */
  utcAdd(
    date: Date,
    options: {
      days?: number;
      hours?: number;
      minutes?: number;
      seconds?: number;
      milliseconds?: number;
    },
  ): Date {
    const d = new Date(date);

    if (options.days) d.setUTCDate(d.getUTCDate() + options.days);
    if (options.hours) d.setUTCHours(d.getUTCHours() + options.hours);
    if (options.minutes) d.setUTCMinutes(d.getUTCMinutes() + options.minutes);
    if (options.seconds) d.setUTCSeconds(d.getUTCSeconds() + options.seconds);
    if (options.milliseconds)
      d.setUTCMilliseconds(d.getUTCMilliseconds() + options.milliseconds);

    return d;
  },

  max(a: Date, b: Date): Date {
    return a.getTime() >= b.getTime() ? a : b;
  },

  min(a: Date, b: Date): Date {
    return a.getTime() <= b.getTime() ? a : b;
  },

  /* ========= LOCAL DAY ========= */
  localStartOfDay(local: Date): Date {
    const d = new Date(local);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  localEndOfDay(local: Date): Date {
    const d = new Date(local);
    d.setHours(23, 59, 59, 999);
    return d;
  },

  /* ========= LOCAL TIME ========= */
  localMinutesOfDay(local: Date): number {
    return local.getHours() * 60 + local.getMinutes();
  },

  localFromMinutesOfDay(baseLocalDate: Date, minutes: number): Date {
    const d = new Date(baseLocalDate);
    const m = ((minutes % 1440) + 1440) % 1440;
    d.setHours(Math.floor(m / 60), m % 60, 0, 0);
    return d;
  },

  localSetTime(localDate: Date, time: TimeHHmm): Date {
    const d = new Date(localDate);
    const { hours, minutes } = TimeUtil.parse(time);
    d.setHours(hours, minutes, 0, 0);
    return d;
  },

  localRoundDown(local: Date, stepMinutes = 5): Date {
    const m = DateUtil.localMinutesOfDay(local);
    return DateUtil.localFromMinutesOfDay(
      local,
      Math.floor(m / stepMinutes) * stepMinutes,
    );
  },

  localRoundUp(local: Date, stepMinutes = 5): Date {
    const m = DateUtil.localMinutesOfDay(local);
    return DateUtil.localFromMinutesOfDay(
      local,
      Math.ceil(m / stepMinutes) * stepMinutes,
    );
  },

  toLocalDateString(date: Date): string {
    const d = DateUtil.localStartOfDay(date);
    return DateUtil.toLocalDatetimeString(d, 'yyyy-MM-dd');
  },

  toLocalDatetimeString(
    date: Date,
    format: LocalDatetimeFormat = 'yyyy-MM-dd HH:mm:ss',
  ): string {
    const two = (n: number): string => (n < 10 ? `0${n}` : `${n}`);
    const three = (n: number): string => (n < 100 ? `0${n}` : `${n}`);

    const tokens: Record<string, string> = {
      yyyy: `${date.getFullYear()}`,
      MM: two(date.getMonth() + 1),
      dd: two(date.getDate()),
      HH: two(date.getHours()),
      mm: two(date.getMinutes()),
      ss: two(date.getSeconds()),
      SSS: three(date.getMilliseconds()),
    };

    return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS/g, (token) => tokens[token]);
  },
};

/** */
export const TimeUtil = {
  isValidHHmm(value: string): value is TimeHHmm {
    return TIME_HH_MM_REGEX.test(value);
  },

  parse(time: TimeHHmm): { hours: number; minutes: number } {
    const [h, m] = time.split(':').map(Number);
    return { hours: h, minutes: m };
  },

  toMinutes(time: TimeHHmm): number {
    const { hours, minutes } = TimeUtil.parse(time);
    return hours * 60 + minutes;
  },

  fromMinutes(totalMinutes: number): TimeHHmm {
    const normalized = TimeUtil.normalizeMinutesInDay(totalMinutes);
    const h = Math.floor(normalized / 60);
    const m = normalized % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}` as TimeHHmm;
  },

  normalizeMinutesInDay(minutes: number): number {
    const m = minutes % 1440;
    return m < 0 ? m + 1440 : m;
  },

  round(time: TimeHHmm, step = 5): TimeHHmm {
    const total = TimeUtil.toMinutes(time);
    return TimeUtil.fromMinutes(Math.round(total / step) * step);
  },

  roundDown(time: TimeHHmm, step = 5): TimeHHmm {
    const total = TimeUtil.toMinutes(time);
    return TimeUtil.fromMinutes(Math.floor(total / step) * step);
  },

  roundUp(time: TimeHHmm, step = 5): TimeHHmm {
    const total = TimeUtil.toMinutes(time);
    return TimeUtil.fromMinutes(Math.ceil(total / step) * step);
  },

  max(time1: TimeHHmm, time2: TimeHHmm): TimeHHmm {
    return TimeUtil.toMinutes(time1) >= TimeUtil.toMinutes(time2)
      ? time1
      : time2;
  },

  min(time1: TimeHHmm, time2: TimeHHmm): TimeHHmm {
    return TimeUtil.toMinutes(time1) <= TimeUtil.toMinutes(time2)
      ? time1
      : time2;
  },
};

/** */
export const CalendarUtil = {
  isValidDayOfWeek(value: string): value is DaysOfWeek {
    return DAYS_OF_WEEK_VALUES.includes(value as DaysOfWeek);
  },

  dayOfWeek(date: Date): DaysOfWeek {
    return DAYS_OF_WEEK_ORDER[date.getDay()];
  },
};
