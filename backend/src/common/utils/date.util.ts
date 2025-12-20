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
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}` as TimeHHmm;
  },

  roundHHmm(time: TimeHHmm, step = 5): TimeHHmm {
    const total = DateUtil.hhmmToMinutes(time);
    const rounded = Math.round(total / step) * step;
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
