export class SuccessResponse<T> {
  success = true;
  timestamp: string;
  data: T;
  message: string;
  meta?: Record<string, any>;

  constructor(data: T, message = 'OK', meta?: Record<string, any>) {
    this.timestamp = new Date().toISOString();
    this.data = data;
    this.message = message;
    if (meta) this.meta = meta;
  }

  //
  static of<T>(data: T, message: string = 'OK') {
    return new SuccessResponse(data, message);
  }

  static withPagination<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
    message?: string,
  ) {
    const meta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return new SuccessResponse(items, message ?? 'OK', meta);
  }

  static created<T>(data: T, message = 'Created successfully') {
    return new SuccessResponse(data, message);
  }
}
