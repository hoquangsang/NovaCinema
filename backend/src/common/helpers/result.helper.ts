export type Success<T> = {
  isSuccess: true;
  isFailure: false;
  value: T;
};

export type Failure<E = string> = {
  isSuccess: false;
  isFailure: true;
  message?: string;
  errors?: E[];
};

export type Result<T, E = string> = Success<T> | Failure<E>;

/** */
export const Result = {
  ok<T>(value: T): Success<T> {
    return {
      isSuccess: true,
      isFailure: false,
      value,
    };
  },

  fail<E = string>(options?: { message?: string; errors?: E[] }): Failure<E> {
    return {
      isSuccess: false,
      isFailure: true,
      message: options?.message,
      errors: options?.errors,
    };
  },
};
