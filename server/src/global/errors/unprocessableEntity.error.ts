import CustomError from "./customError.error";

export default class UnprocessableEntityError extends CustomError<"UNPROCESSABLE_ENTITY"> {
  constructor(message = "Unable to process the provided data") {
    super({ message, statusCode: 422, code: "UNPROCESSABLE_ENTITY" });
  }
}
