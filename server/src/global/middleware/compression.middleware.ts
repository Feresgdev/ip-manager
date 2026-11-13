import compression from "compression";
import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors";

const enabled = process.env.COMPRESSION_ENABLED !== "false";

const level = Number(process.env.COMPRESSION_LEVEL ?? 6);
const threshold = Number(process.env.COMPRESSION_THRESHOLD ?? 1024);

// zlib levels: -1 (default) or 0-9.
if (!Number.isInteger(level) || level < -1 || level > 9) {
  throw new BadRequestError(
    "Invalid COMPRESSION_LEVEL configuration (expected -1 to 9)",
  );
}

if (!Number.isFinite(threshold) || threshold < 0) {
  throw new BadRequestError("Invalid COMPRESSION_THRESHOLD configuration");
}

export const compressionMiddleware = enabled
  ? compression({
      level,
      threshold,
      filter: (req, res) => {
        // Respect the client's no-compression preference.
        if (req.headers["x-no-compression"]) {
          return false;
        }

        return compression.filter(req, res);
      },
    })
  : (_req: Request, _res: Response, next: NextFunction) => next();
