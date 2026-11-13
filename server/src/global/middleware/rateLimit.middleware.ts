import { rateLimit } from "express-rate-limit";
import { TooManyRequestsError } from "../errors";

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);
const limit = Number(process.env.RATE_LIMIT_MAX ?? 100);

if (!Number.isFinite(windowMs) || windowMs <= 0) {
  throw new Error("Invalid RATE_LIMIT_WINDOW_MS configuration");
}

if (!Number.isInteger(limit) || limit <= 0) {
  throw new Error("Invalid RATE_LIMIT_MAX configuration");
}

export const globalRateLimiter = rateLimit({
  windowMs,
  limit,

  standardHeaders: true,
  legacyHeaders: false,

  handler: () => {
    throw new TooManyRequestsError();
  },
});
