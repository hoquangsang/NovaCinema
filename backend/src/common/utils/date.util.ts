import { DateTime } from 'luxon';

const ZONE = 'Asia/Ho_Chi_Minh';

const DATETIME_FORMATS = [
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

type DateTimeFormatType = (typeof DATETIME_FORMATS)[number];

export const DateUtil = {
  /* ========= NOW ========= */
  now(): Date {
    return DateTime.now().setZone(ZONE).toJSDate();
  },

  /* ========= PARSE & FORMAT ========= */
  parse(raw: Date | string | number): Date {
    return toJSDate(toDateTime(raw));
  },

  toDateString(raw: Date | string | number): string {
    return toDateTime(raw).toFormat('yyyy-MM-dd');
  },

  toDatetimeString(
    raw: Date | string | number,
    format: DateTimeFormatType = 'yyyy-MM-dd HH:mm:ss',
  ): string {
    return toDateTime(raw).toFormat(format);
  },

  /* ========= BASIC OPS ========= */
  add(raw: Date | string, spec: object): Date {
    return toJSDate(toDateTime(raw).plus(spec));
  },

  subtract(raw: Date | string, spec: object): Date {
    return toJSDate(toDateTime(raw).minus(spec));
  },

  max(a: Date, b: Date): Date {
    return a.getTime() >= b.getTime() ? a : b;
  },

  min(a: Date, b: Date): Date {
    return a.getTime() <= b.getTime() ? a : b;
  },

  compare(a: Date | string, b: Date | string): number {
    return toDateTime(a).toMillis() - toDateTime(b).toMillis();
  },

  isBefore(a: Date | string, b: Date | string): boolean {
    return toDateTime(a).toMillis() < toDateTime(b).toMillis();
  },

  isAfter(a: Date | string, b: Date | string): boolean {
    return toDateTime(a).toMillis() > toDateTime(b).toMillis();
  },

  isSameDay(a: Date | string, b: Date | string): boolean {
    const da = toDateTime(a);
    const db = toDateTime(b);
    return da.year === db.year && da.month === db.month && da.day === db.day;
  },

  /* ========= DAY OPS ========= */
  startOfDay(raw: Date | string): Date {
    return toJSDate(toDateTime(raw).startOf('day'));
  },

  endOfDay(raw: Date | string): Date {
    return toJSDate(toDateTime(raw).endOf('day'));
  },

  addDays(raw: Date | string, days: number): Date {
    return toJSDate(toDateTime(raw).plus({ days }));
  },

  /* ========= WEEK OPS ========= */
  weekday(raw: string | number | Date): number {
    // Luxon: Monday=1 → 7;
    // JS: Sunday=0
    return toDateTime(raw).weekday % 7;
  },

  /* ========= MONTH OPS ========= */
  startOfMonth(raw: Date | string): Date {
    return toJSDate(toDateTime(raw).startOf('month'));
  },

  endOfMonth(raw: Date | string): Date {
    return toJSDate(toDateTime(raw).endOf('month'));
  },

  /* ========= TIME-OF-DAY OPS ========= */
  minutesOfDay(raw: Date | string): number {
    const d = toDateTime(raw);
    return d.hour * 60 + d.minute;
  },

  setMinutesOfDay(base: Date | string, minutes: number): Date {
    const normalized = ((minutes % 1440) + 1440) % 1440;
    const h = Math.floor(normalized / 60);
    const m = normalized % 60;
    return toJSDate(
      toDateTime(base).set({ hour: h, minute: m, second: 0, millisecond: 0 }),
    );
  },

  roundDown(raw: Date | string, step = 5): Date {
    const m = DateUtil.minutesOfDay(raw);
    const rounded = Math.floor(m / step) * step;
    return DateUtil.setMinutesOfDay(raw, rounded);
  },

  roundUp(raw: Date | string, step = 5): Date {
    const m = DateUtil.minutesOfDay(raw);
    const rounded = Math.ceil(m / step) * step;
    return DateUtil.setMinutesOfDay(raw, rounded);
  },
};

/** parse to Luxon DateTime in local zone */
const toDateTime = (raw: Date | string | number): DateTime => {
  if (raw instanceof Date) {
    return DateTime.fromJSDate(raw, { zone: ZONE });
  }

  if (typeof raw === 'string') {
    // yyyy-MM-dd (date-only)
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return DateTime.fromFormat(raw, 'yyyy-MM-dd', { zone: ZONE });
    }

    // ISO or any timestamp
    const parsed = DateTime.fromISO(raw);
    return parsed.isOffsetFixed
      ? parsed // fix offset
      : DateTime.fromISO(raw, { zone: ZONE });
  }

  if (typeof raw === 'number') {
    return DateTime.fromMillis(raw, { zone: ZONE });
  }

  throw new Error('Invalid date input');
};

/** convert DateTime to JS Date (UTC) */
const toJSDate = (d: DateTime): Date => d.toJSDate();
