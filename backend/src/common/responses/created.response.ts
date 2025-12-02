export class CreatedResponse<T> {
  success: true;
  data: T;
  message: string;

  constructor(data: T, message = "Created successfully") {
    this.success = true;
    this.data = data;
    this.message = message;
  }
}
