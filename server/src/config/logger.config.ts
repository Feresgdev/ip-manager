import pino from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: "debug",

  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
      singleLine: false,
      errorLikeObjectKeys: ["err", "error"],
    },
  },

  redact: {
    paths: ["password", "token", "authorization", "headers.authorization"],
    censor: "[REDACTED]",
  },
});
