import CustomError from "./customError.error";

export default class TooManyRequestsError extends CustomError<"TOO_MANY_REQUESTS"> {
  constructor(message = "Too many requests") {
    super({ message, statusCode: 429, code: "TOO_MANY_REQUESTS" });
  }
}
