import CustomError from "./customError.error";

export default class NotAcceptableError extends CustomError<"NOT_ACCEPTABLE"> {
  constructor(message = "Requested format is not acceptable") {
    super({ message, statusCode: 406, code: "NOT_ACCEPTABLE" });
  }
}
