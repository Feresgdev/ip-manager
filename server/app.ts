import express from "express";
import { corsMiddleware } from "./src/config/cors.config";
import { swaggerSpec } from "./src/config/swagger.config";
import swaggerUi from "swagger-ui-express";
import path from "path";

import errorHandler from "./src/global/middleware/error.handler";
import requestContext from "./src/global/middleware/requestContext.middleware";
import { compressionMiddleware } from "./src/global/middleware/compression.middleware";
import emailRouter from "./src/modules/email/email.route";
import systemRouter from "./src/modules/system/system.routes";
import { globalRateLimiter } from "./src/global/middleware/rateLimit.middleware";
import helmet from "helmet";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(requestContext);
app.use(compressionMiddleware);
app.use(corsMiddleware);
app.use(express.json());

app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use(globalRateLimiter);

app.use("/api/system", systemRouter);

app.use("/api/email", emailRouter);

app.use(errorHandler);

export default app;
