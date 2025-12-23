export class ErrorResponse {
  success = false;
  timestamp: string;
  message: string;
  code?: number;
  path?: string;
  errors?: any[];

  constructor(message: string, code?: number, path?: string, error?: any[]) {
    this.timestamp = new Date().toISOString();
    this.message = message;
    this.code = code;
    this.path = path;
    this.errors = error;
  }
}
