import CustomError from "./customError.error";

export default class InternalServerError extends CustomError<"INTERNAL_SERVER_ERROR"> {
  constructor(message = "An unexpected server error occurred") {
    super({ message, statusCode: 500, code: "INTERNAL_SERVER_ERROR" });
  }
}
