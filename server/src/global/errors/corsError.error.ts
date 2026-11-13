import CustomError from "./customError.error";

export default class CorsError extends CustomError<"CORS_ERROR"> {
  constructor(origin: string) {
    super({
      message: `Origin '${origin}' is not allowed by CORS policy`,
      statusCode: 403,
      code: "CORS_ERROR",
    });
  }
}
