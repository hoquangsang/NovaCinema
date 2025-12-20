// date.util.ts
import {
  DAYS_OF_WEEK_ORDER,
  DAYS_OF_WEEK_VALUES,
  DaysOfWeek,
  TIME_HH_MM_REGEX,
  TimeHHmm,
} from '../types';

export const DateUtil = {
  /* ===================== */
  /* HH:mm helpers */
  /* ===================== */
  isValidHHmm(value: string): value is TimeHHmm {
    return TIME_HH_MM_REGEX.test(value);
  },

  parseHHmm(time: TimeHHmm): { hours: number; minutes: number } {
    const [h, m] = time.split(':').map(Number);
    return { hours: h, minutes: m };
  },

  hhmmToMinutes(time: TimeHHmm): number {
    const { hours, minutes } = DateUtil.parseHHmm(time);
    return hours * 60 + minutes;
  },

  minutesToHHmm(totalMinutes: number): TimeHHmm {
    const normalized = DateUtil.normalizeMinutesOfDay(totalMinutes);
    const h = Math.floor(normalized / 60);
    const m = normalized % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}` as TimeHHmm;
  },

  roundHHmm(time: TimeHHmm, step = 5): TimeHHmm {
    const total = DateUtil.hhmmToMinutes(time);
    const rounded = Math.round(total / step) * step;
    return DateUtil.minutesToHHmm(rounded);
  },

  roundDownHHmm(time: TimeHHmm, step = 5): TimeHHmm {
    const total = DateUtil.hhmmToMinutes(time);
    const rounded = Math.floor(total / step) * step;
    return DateUtil.minutesToHHmm(rounded);
  },

  roundUpHHmm(time: TimeHHmm, step = 5): TimeHHmm {
    const total = DateUtil.hhmmToMinutes(time);
    const rounded = Math.ceil(total / step) * step;
    return DateUtil.minutesToHHmm(rounded);
  },

  setTime(date: Date, time: TimeHHmm): Date {
    const d = new Date(date);
    const { hours, minutes } = DateUtil.parseHHmm(time);
    d.setHours(hours, minutes, 0, 0);
    return d;
  },

  /* ===================== */
  /* Date helpers */
  /* ===================== */
  now(): Date {
    return new Date();
  },

  startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  },

  roundUpDate(date: Date, stepMinutes = 5): Date {
    const totalMinutes = date.getHours() * 60 + date.getMinutes();
    const roundedMinutes = Math.ceil(totalMinutes / stepMinutes) * stepMinutes;
    const d = new Date(date);
    d.setHours(Math.floor(roundedMinutes / 60), roundedMinutes % 60, 0, 0);
    return d;
  },

  roundDownDate(date: Date, stepMinutes = 5): Date {
    const totalMinutes = date.getHours() * 60 + date.getMinutes();
    const roundedMinutes = Math.floor(totalMinutes / stepMinutes) * stepMinutes;
    const d = new Date(date);
    d.setHours(Math.floor(roundedMinutes / 60), roundedMinutes % 60, 0, 0);
    return d;
  },

  normalizeMinutesOfDay(minutes: number): number {
    const m = minutes % 1440;
    return m < 0 ? m + 1440 : m;
  },

  minutesOfDay(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
  },

  fromMinutesOfDay(baseDate: Date, minutes: number): Date {
    const d = new Date(baseDate);
    d.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    return d;
  },

  /* ===================== */
  /* DayOfWeek helpers */
  /* ===================== */
  isValidDayOfWeek(value: string): value is DaysOfWeek {
    return DAYS_OF_WEEK_VALUES.includes(value as DaysOfWeek);
  },

  dayOfWeek(date: Date): DaysOfWeek {
    return DAYS_OF_WEEK_ORDER[date.getDay()];
  },
};
