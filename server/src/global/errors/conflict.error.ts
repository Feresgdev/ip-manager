import CustomError from "./customError.error";

export default class ConflictError extends CustomError<"CONFLICT"> {
  constructor(message = "Resource conflict") {
    super({ message, statusCode: 409, code: "CONFLICT" });
  }
}
