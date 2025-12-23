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
  meta: {
    count: number;
    sort?: Record<string, any>;
    filters?: Record<string, any>;
  };

  constructor(
    items: T[],
    message = 'OK',
    options?: {
      sort?: Record<string, any>;
      filters?: Record<string, any>;
    },
  ) {
    super(message);
    this.data = items;
    this.meta = {
      count: items.length,
      ...options,
    };
  }
}

export class PaginatedResponse<T> extends BaseResponse {
  data: T[];
  meta: {
    total: number;
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    sort?: Record<string, any>;
    filters?: Record<string, any>;
  };

  constructor(
    items: T[],
    total: number,
    page: number,
    limit: number,
    message = 'OK',
    options?: {
      sort?: Record<string, any>;
      filters?: Record<string, any>;
    },
  ) {
    super(message);
    this.data = items;
    const totalPages = Math.ceil(total / limit);
    this.meta = {
      total,
      count: items.length,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      ...options,
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
