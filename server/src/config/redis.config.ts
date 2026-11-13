import { Redis } from "ioredis";
import { logger } from "./logger.config";

export const redis = new Redis(process.env.REDIS_URL!);

redis.on("connect", () => logger.info("Redis connection established"));
redis.on("error", (err) => logger.error({ err }, "Redis error"));
