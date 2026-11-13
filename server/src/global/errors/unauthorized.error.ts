import CustomError from "./customError.error";

export default class UnauthorizedError extends CustomError<"UNAUTHORIZED"> {
  constructor(message = "Authentication required") {
    super({ message, statusCode: 401, code: "UNAUTHORIZED" });
  }
}
