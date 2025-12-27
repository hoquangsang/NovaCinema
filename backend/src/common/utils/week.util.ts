import { DAYS_OF_WEEK_ORDER, DAYS_OF_WEEK_VALUES, DaysOfWeek } from '../types';
import { DateUtil } from './date.util';

/** */
export const WeekUtil = {
  isValidDayOfWeek(value: string): value is DaysOfWeek {
    return DAYS_OF_WEEK_VALUES.includes(value as DaysOfWeek);
  },

  dayOfWeek(raw: Date | string | number): DaysOfWeek {
    return DAYS_OF_WEEK_ORDER[DateUtil.weekday(raw)];
  },
};
