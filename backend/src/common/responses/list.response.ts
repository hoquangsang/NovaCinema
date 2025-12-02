export class ListResponse<T> {
  success = true;
  data: T[];
  message: string;

  constructor(data: T[], message = 'OK') {
    this.data = data;
    this.message = message;
  }
}
