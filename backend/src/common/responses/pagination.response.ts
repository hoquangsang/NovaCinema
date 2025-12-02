export class PaginationResponse<T> {
  success = true;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  message: string;

  constructor(items: T[], meta: { total: number; page: number; limit: number }, message = 'OK') {
    this.data = items;
    this.meta = meta;
    this.message = message;
  }
}
