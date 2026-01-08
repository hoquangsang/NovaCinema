import { DateUtil } from 'src/common/utils';
import { MovieDocument } from 'src/modules/movies';

/* ========= DATE  ========= */
export const startOfDay = DateUtil.startOfDay;
export const endOfDay = DateUtil.endOfDay;
export const addDays = DateUtil.addDays;
export const addMinutes = (raw: Date, minutes: number) =>
  DateUtil.add(raw, { minutes });

export const minuteToDate = DateUtil.setMinutesOfDay;
export const roundUp = DateUtil.roundUp;
export const roundDown = DateUtil.roundDown;

/* ========= RANDOM ========= */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const shuffle = <T>(arr: T[]): T[] => {
  return [...arr].sort(() => Math.random() - 0.5);
};

/* ========= MOVIE ========= */
export const computeMovieEndDate = (movie: MovieDocument): Date => {
  if (movie.endDate) {
    return endOfDay(movie.endDate);
  }

  const days = randomInt(14, 28);
  return endOfDay(addDays(movie.releaseDate, days));
};

export const pickMovieShowWindow = (releaseDate: Date, endDate: Date) => {
  const MIN_DAYS = 14;
  const MAX_DAYS = 28;

  const startDay = startOfDay(releaseDate);
  const endDay = startOfDay(endDate);

  const totalDays = Math.ceil(
    (endDay.getTime() - startDay.getTime()) / 86_400_000,
  );

  const windowDays =
    totalDays <= MIN_DAYS
      ? totalDays
      : randomInt(MIN_DAYS, Math.min(MAX_DAYS, totalDays));

  const maxOffset = Math.max(0, totalDays - windowDays);
  const offsetDays = maxOffset > 0 ? randomInt(0, maxOffset) : 0;

  const start = addDays(startDay, offsetDays);
  const end = addDays(start, windowDays);

  return { start, end };
};
