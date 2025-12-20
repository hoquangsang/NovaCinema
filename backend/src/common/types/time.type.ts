/** */
export const TIME_HH_MM_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type HourTens = '0' | '1';
type HourOnes = Digit;
type Hour20to23 = '20' | '21' | '22' | '23';
type MinuteTens = '0' | '1' | '2' | '3' | '4' | '5';
type MinuteOnes = Digit;
export type TimeHHmm =
  | `${HourTens}${HourOnes}:${MinuteTens}${MinuteOnes}`
  | `${Hour20to23}:${MinuteTens}${MinuteOnes}`;

/** */
export const DAYS_OF_WEEK = {
  SUN: 'SUN',
  MON: 'MON',
  TUE: 'TUE',
  WED: 'WED',
  THU: 'THU',
  FRI: 'FRI',
  SAT: 'SAT',
} as const;

export const DAYS_OF_WEEK_ORDER: DaysOfWeek[] = [
  DAYS_OF_WEEK.SUN,
  DAYS_OF_WEEK.MON,
  DAYS_OF_WEEK.TUE,
  DAYS_OF_WEEK.WED,
  DAYS_OF_WEEK.THU,
  DAYS_OF_WEEK.FRI,
  DAYS_OF_WEEK.SAT,
];

export const DAYS_OF_WEEK_VALUES = Object.values(DAYS_OF_WEEK);

export type DaysOfWeek = (typeof DAYS_OF_WEEK)[keyof typeof DAYS_OF_WEEK];
