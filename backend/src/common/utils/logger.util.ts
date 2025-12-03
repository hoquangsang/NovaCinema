import { Logger } from "@nestjs/common";

export class LoggerUtil {
  private static logger = new Logger("App");

  static info(msg: any) {
    LoggerUtil.logger.log(LoggerUtil.format(msg));
  }

  static error(msg: any) {
    LoggerUtil.logger.error(LoggerUtil.format(msg));
  }

  static warn(msg: any) {
    LoggerUtil.logger.warn(LoggerUtil.format(msg));
  }

  static debug(msg: any) {
    LoggerUtil.logger.debug(LoggerUtil.format(msg));
  }

  private static format(msg: any): string {
    return typeof msg === "string" ? msg : JSON.stringify(msg);
  }
}
