import { MovieDocument } from 'src/modules/movies';

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function minuteToDate(date: Date, minute: number) {
  const d = new Date(date);
  d.setHours(Math.floor(minute / 60), minute % 60, 0, 0);
  return d;
}

export function round5(min: number) {
  return Math.ceil(min / 5) * 5;
}

export function ceilTo5Minutes(date: Date): Date {
  const ms = date.getTime();
  const five = 5 * 60 * 1000;
  return new Date(Math.ceil(ms / five) * five);
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function computeMovieEndDate(movie: MovieDocument): Date {
  if (movie.endDate) return movie.endDate;

  const days = randomInt(14, 28);
  return new Date(movie.releaseDate.getTime() + days * 24 * 60 * 60 * 1000);
}

export function pickMovieShowWindow(releaseDate: Date, endDate: Date) {
  const MIN_DAYS = 14;
  const MAX_DAYS = 28;

  const totalDays = Math.ceil(
    (endDate.getTime() - releaseDate.getTime()) / 86400000,
  );

  const windowDays =
    totalDays <= MIN_DAYS
      ? totalDays
      : randomInt(MIN_DAYS, Math.min(MAX_DAYS, totalDays));

  const maxOffset = Math.max(0, totalDays - windowDays);
  const offsetDays = maxOffset > 0 ? randomInt(0, maxOffset) : 0;

  const start = addDays(startOfDay(releaseDate), offsetDays);
  const end = addDays(start, windowDays);

  return { start, end };
}
