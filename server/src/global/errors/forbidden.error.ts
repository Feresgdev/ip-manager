import CustomError from "./customError.error";

export default class ForbiddenError extends CustomError<"FORBIDDEN"> {
  constructor(message = "You do not have permission to access this resource") {
    super({ message, statusCode: 403, code: "FORBIDDEN" });
  }
}
