import "reflect-metadata";
import app from "./app";
import { banner } from "./src/config/banner.config";
import { emailTransporter } from "./src/config/email.config";
import { logger } from "./src/config/logger.config";
import { AppDataSource } from "./src/config/database.config";

const port = Number(process.env.SERVER_PORT ?? 3000);

async function bootstrap() {
  logger.info(banner);
  try {
    await AppDataSource.initialize();
    await AppDataSource.query("SELECT 1");
    logger.info("Database connection established");
  } catch (error) {
    logger.error({ err: error }, "Database connection failed");
    process.exit(1);
  }

  emailTransporter
    .verify()
    .then(() => logger.info("SMTP connection established"))
    .catch((error) => logger.error({ err: error }, "SMTP connection failed"));

  app.listen(port, "0.0.0.0", () => {
    logger.info(`envirement : ${process.env.NODE_ENV}`);
    logger.info(`Server listening on http://localhost:${port}`);
  });
}

bootstrap();
