export const LoggerUtil = {
  json: (...msg: any[]) => console.log(JSON.stringify(msg, null, 2)),
};
