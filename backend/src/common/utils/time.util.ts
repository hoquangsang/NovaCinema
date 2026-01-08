import { TIME_HH_MM_REGEX, TimeHHmm } from '../types';

/** */
export const TimeUtil = {
  /* ========= VALIDATION ========= */
  isValidHHmm(value: string): value is TimeHHmm {
    return TIME_HH_MM_REGEX.test(value);
  },

  /* ========= PARSE & FORMAT ========= */
  parse(time: TimeHHmm): { hours: number; minutes: number } {
    return parseTime(time);
  },

  toMinutes(time: TimeHHmm): number {
    const { hours, minutes } = parseTime(time);
    return hours * 60 + minutes;
  },

  fromMinutes(totalMinutes: number): TimeHHmm {
    return formatHHmm(normalizeMinutes(totalMinutes));
  },

  /* ========= NORMALIZATION ========= */
  normalizeMinutesInDay(minutes: number): number {
    return normalizeMinutes(minutes);
  },

  /* ========= ROUNDING ========= */
  round(time: TimeHHmm, step = 5): TimeHHmm {
    return TimeUtil.fromMinutes(
      Math.round(TimeUtil.toMinutes(time) / step) * step,
    );
  },

  roundDown(time: TimeHHmm, step = 5): TimeHHmm {
    return TimeUtil.fromMinutes(
      Math.floor(TimeUtil.toMinutes(time) / step) * step,
    );
  },

  roundUp(time: TimeHHmm, step = 5): TimeHHmm {
    return TimeUtil.fromMinutes(
      Math.ceil(TimeUtil.toMinutes(time) / step) * step,
    );
  },

  /* ========= MIN/MAX ========= */
  max(a: TimeHHmm, b: TimeHHmm): TimeHHmm {
    return TimeUtil.toMinutes(a) >= TimeUtil.toMinutes(b) ? a : b;
  },

  min(a: TimeHHmm, b: TimeHHmm): TimeHHmm {
    return TimeUtil.toMinutes(a) <= TimeUtil.toMinutes(b) ? a : b;
  },
};

/* ========= HELPERS (giống phong cách DateUtil) ========= */

const parseTime = (t: TimeHHmm) => {
  const [h, m] = t.split(':').map(Number);
  return { hours: h, minutes: m };
};

const normalizeMinutes = (minutes: number) => {
  const m = minutes % 1440;
  return m < 0 ? m + 1440 : m;
};

const formatHHmm = (minutes: number): TimeHHmm => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}` as TimeHHmm;
};
