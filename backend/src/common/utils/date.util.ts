// import { TimeHHmm } from '../types';
// import { TimeUtil } from './datetime.util';

// export const DateUtil = {
//   now(): Date {
//     return new Date();
//   },

//   startOfDay(date: Date): Date {
//     const d = new Date(date);
//     d.setHours(0, 0, 0, 0);
//     return d;
//   },

//   endOfDay(date: Date): Date {
//     const d = new Date(date);
//     d.setHours(23, 59, 59, 999);
//     return d;
//   },

//   minutesOfDay(date: Date): number {
//     return date.getHours() * 60 + date.getMinutes();
//   },

//   fromMinutesOfDay(baseDate: Date, minutes: number): Date {
//     const d = new Date(baseDate);
//     d.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
//     return d;
//   },

//   roundDown(date: Date, stepMinutes = 5): Date {
//     const total = DateUtil.minutesOfDay(date);
//     const rounded = Math.floor(total / stepMinutes) * stepMinutes;
//     return DateUtil.fromMinutesOfDay(date, rounded);
//   },

//   roundUp(date: Date, stepMinutes = 5): Date {
//     const total = DateUtil.minutesOfDay(date);
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

//   setTime(date: Date, time: TimeHHmm): Date {
//     const { hours, minutes } = TimeUtil.parse(time);
//     const d = new Date(date);
//     d.setHours(hours, minutes, 0, 0);
//     return d;
//   },
// };
