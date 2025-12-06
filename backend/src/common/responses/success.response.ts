export abstract class BaseResponse {
  success = true;
  timestamp = new Date().toISOString();
  message: string;

  constructor(message = 'OK') {
    this.message = message;
  }
}

export class SuccessResponse<T> extends BaseResponse {
  data: T;

  constructor(data: T, message = 'OK') {
    super(message);
    this.data = data;
  }
}

export class ListResponse<T> extends BaseResponse {
  data: T[];

  constructor(items: T[], message = 'OK') {
    super(message);
    this.data = items;
  }
}

export class PaginatedResponse<T> extends BaseResponse {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  constructor(items: T[], total: number, page: number, limit: number, message = 'OK') {
    super(message);
    this.data = items;
    this.meta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export class CreatedResponse<T> extends BaseResponse {
  data: T;

  constructor(data: T, message = 'Created') {
    super(message);
    this.data = data;
  }
}
