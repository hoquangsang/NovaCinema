export { CalendarUtil, DateUtil, TimeUtil } from './datetime.util';
export { HashUtil } from './hash.util';
export { LoggerUtil } from './logger.util';

// export const DateUtil = {
//   nowUtc(): Date {
//     return new Date();
//   },

//   now(tz = TIMEZONE_OFFSET): Date {
//     // TIMEZONE_OFFSET
//     return DateUtil.toLocal(DateUtil.nowUtc(), tz);
//   },

//   toLocal(date: Date, tz = TIMEZONE_OFFSET): Date {
//     return new Date(date.getTime() + tz * 60_000);
//   },

//   fromLocal(local: Date, tz = TIMEZONE_OFFSET): Date {
//     return new Date(local.getTime() - tz * 60_000);
//   },

//   startOfDay(date: Date, tz = TIMEZONE_OFFSET): Date {
//     const local = DateUtil.toLocal(date, tz);
//     local.setHours(0, 0, 0, 0);
//     return DateUtil.fromLocal(local, tz);
//   },

//   endOfDay(date: Date, tz = TIMEZONE_OFFSET): Date {
//     const local = DateUtil.toLocal(date, tz);
//     local.setHours(23, 59, 59, 999);
//     return DateUtil.fromLocal(local, tz);
//   },

//   minutesOfDay(date: Date, tz = TIMEZONE_OFFSET): number {
//     const local = DateUtil.toLocal(date, tz);
//     return local.getHours() * 60 + local.getMinutes();
//   },

//   fromMinutesOfDay(
//     baseDate: Date,
//     minutes: number,
//     tz = TIMEZONE_OFFSET,
//   ): Date {
//     const local = DateUtil.toLocal(baseDate, tz);
//     const m = ((minutes % 1440) + 1440) % 1440;

//     local.setHours(Math.floor(m / 60), m % 60, 0, 0);
//     return DateUtil.fromLocal(local, tz);
//   },

//   roundDown(date: Date, stepMinutes = 5, tz = TIMEZONE_OFFSET): Date {
//     const total = DateUtil.minutesOfDay(date, tz);
//     const rounded = Math.floor(total / stepMinutes) * stepMinutes;
//     return DateUtil.fromMinutesOfDay(date, rounded);
//   },

//   roundUp(date: Date, stepMinutes = 5, tz = TIMEZONE_OFFSET): Date {
//     const total = DateUtil.minutesOfDay(date, tz);
//     const rounded = Math.ceil(total / stepMinutes) * stepMinutes;
//     return DateUtil.fromMinutesOfDay(date, rounded);
//   },

//   add(
//     date: Date,
//     options: {
//       days?: number;
//       hours?: number;
//       minutes?: number;
//       seconds?: number;
//       milliseconds?: number;
//     },
//   ): Date {
//     const {
//       days = 0,
//       hours = 0,
//       minutes = 0,
//       seconds = 0,
//       milliseconds = 0,
//     } = options;

//     const d = new Date(date);

//     if (days) d.setDate(d.getDate() + days);
//     if (hours) d.setHours(d.getHours() + hours);
//     if (minutes) d.setMinutes(d.getMinutes() + minutes);
//     if (seconds) d.setSeconds(d.getSeconds() + seconds);
//     if (milliseconds) d.setMilliseconds(d.getMilliseconds() + milliseconds);

//     return d;
//   },

//   setTime(date: Date, time: TimeHHmm, tz = TIMEZONE_OFFSET): Date {
//     const local = DateUtil.toLocal(date, tz);
//     const { hours, minutes } = TimeUtil.parse(time);

//     local.setHours(hours, minutes, 0, 0);
//     return DateUtil.fromLocal(local, tz);
//   },

//   max(date1: Date, date2: Date): Date {
//     return date1.getTime() >= date2.getTime() ? date1 : date2;
//   },

//   min(date1: Date, date2: Date): Date {
//     return date1.getTime() <= date2.getTime() ? date1 : date2;
//   },
// };
