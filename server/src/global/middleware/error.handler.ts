import { NextFunction, Request, Response } from "express";
import { BadRequestError, CustomError, InternalServerError } from "../errors";
import { logger } from "../../config/logger.config";
import multer from "multer";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        error = new BadRequestError(
          "File size exceeds the maximum allowed upload size.",
        );
        break;

      case "LIMIT_FILE_COUNT":
        error = new BadRequestError("Too many files uploaded.");
        break;

      case "LIMIT_UNEXPECTED_FILE":
        error = new BadRequestError("Unexpected file field.");
        break;

      default:
        error = new BadRequestError(`Upload error: ${error.message}`);
    }
  }

  const timestamp = new Date().toISOString();
  const requestId = res.locals.requestId ?? "unknown";
  const durationMs = res.locals.requestStartedAt
    ? Date.now() - res.locals.requestStartedAt
    : null;

  const path = req.path;
  const route = req.route ? `${req.baseUrl}${req.route.path}` : null;

  const metadata = {
    requestId,
    timestamp,
    method: req.method,
    path,
    route,
    durationMs,
    ip: req.ip,
    userAgent: req.get("user-agent") ?? null,
    environment: process.env.NODE_ENV ?? "development",
  };

  if (error instanceof CustomError) {
    logger.warn(
      {
        ...metadata,
        error: {
          name: error.name,
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
        },
      },
      "HTTP request error",
    );

    return res.status(error.statusCode).json({
      success: false,
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        timestamp,
        requestId,
        path,
        route,
        method: req.method,
        durationMs,
      },
    });
  }

  logger.error(
    {
      ...metadata,
      err: error,
    },
    "Unhandled application error",
  );

  const internalError = new InternalServerError();

  return res.status(500).json({
    success: false,
    error: {
      name: internalError.name,
      message: internalError.message,
      code: internalError.code,
      statusCode: 500,
      timestamp,
      requestId,
      path,
      route,
      method: req.method,
      durationMs,
    },
  });
}
