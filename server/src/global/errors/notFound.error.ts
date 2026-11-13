import CustomError from "./customError.error";

export default class NotFoundError extends CustomError<"NOT_FOUND"> {
  constructor(message = "Resource not found") {
    super({ message, statusCode: 404, code: "NOT_FOUND" });
  }
}
