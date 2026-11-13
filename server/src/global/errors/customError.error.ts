export default class CustomError<C extends string = string> extends Error {
  public readonly statusCode: number;
  public readonly code?: C;

  constructor({
    message,
    statusCode,
    code,
  }: {
    message: string;
    statusCode: number;
    code?: C;
  }) {
    super(message);

    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace?.(this, new.target);
  }
}
