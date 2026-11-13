import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

export default function requestContext(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestId = randomUUID();

  res.locals.requestId = requestId;
  res.locals.requestStartedAt = Date.now();

  res.setHeader("X-Request-Id", requestId);

  next();
}
