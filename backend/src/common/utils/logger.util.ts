import { Logger } from '@nestjs/common';

export const LoggerUtil = {
  logger: new Logger('App'),

  info: (msg: unknown): void => {
    LoggerUtil.logger.log(LoggerUtil.format(msg));
  },

  error: (msg: unknown): void => {
    LoggerUtil.logger.error(LoggerUtil.format(msg));
  },

  warn: (msg: unknown): void => {
    LoggerUtil.logger.warn(LoggerUtil.format(msg));
  },

  debug: (msg: unknown): void => {
    LoggerUtil.logger.debug(LoggerUtil.format(msg));
  },

  format: (msg: unknown): string => {
    if (typeof msg === 'string') return msg;
    try {
      return JSON.stringify(msg, null, 2);
    } catch {
      return String(msg);
    }
  },
};
