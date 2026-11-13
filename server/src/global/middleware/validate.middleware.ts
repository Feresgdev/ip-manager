import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export const validateBody =
  <T>(schema: ZodType<T>): RequestHandler =>
  (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error.issues });
      return;
    }
    req.body = parsed.data;
    next();
  };
