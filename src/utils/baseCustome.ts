export class BaseCustomError extends Error {
  [x: string]: any;

  constructor(message: string | undefined, statuscode: number) {
    super(message);
    this.statuscode = statuscode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
