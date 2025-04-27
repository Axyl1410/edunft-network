// Example: Define a generic type for service results that can be either data or a failure
import { Failure } from './failure';

export type Result<T, E extends Failure = Failure> = Success<T> | Fail<E>;

export class Success<T> {
  readonly value: T;
  constructor(value: T) {
    this.value = value;
  }
  isSuccess(): this is Success<T> {
    return true;
  }
  isFailure(): this is Fail<any> {
    return false;
  }
}

export class Fail<E extends Failure> {
  readonly error: E;
  constructor(error: E) {
    this.error = error;
  }
  isSuccess(): this is Success<any> {
    return false;
  }
  isFailure(): this is Fail<E> {
    return true;
  }
}

// You can add other shared types here, e.g.:
// export type WalletAddress = string;
// export type CID = string;
