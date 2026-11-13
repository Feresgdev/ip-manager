import CustomError from "./customError.error";

export default class BadRequestError extends CustomError<"BAD_REQUEST"> {
  constructor(message = "Bad request") {
    super({ message, statusCode: 400, code: "BAD_REQUEST" });
  }
}
