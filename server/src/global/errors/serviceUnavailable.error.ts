import CustomError from "./customError.error";

export default class ServiceUnavailableError extends CustomError<"SERVICE_UNAVAILABLE"> {
  constructor(message = "Service is temporarily unavailable") {
    super({ message, statusCode: 503, code: "SERVICE_UNAVAILABLE" });
  }
}
