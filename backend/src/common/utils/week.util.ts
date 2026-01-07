import { DAYS_OF_WEEK_ORDER, DAYS_OF_WEEK_VALUES, DayOfWeek } from '../types';
import { DateUtil } from './date.util';

/** */
export const WeekUtil = {
  isValidDayOfWeek(value: string): value is DayOfWeek {
    return DAYS_OF_WEEK_VALUES.includes(value as DayOfWeek);
  },

  dayOfWeek(raw: Date | string | number): DayOfWeek {
    return DAYS_OF_WEEK_ORDER[DateUtil.weekday(raw)];
  },
};
