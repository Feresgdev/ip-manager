# TypeScript Express API Boilerplate

A Dockerized REST API boilerplate built with **Node.js 22, TypeScript, Express 5, PostgreSQL, TypeORM, Zod, and Pino**.

This project provides a reusable backend foundation with centralized error handling, structured logging, database migrations, file storage, Swagger documentation, request validation, and standardized paginated responses.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Requirements](#requirements)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Database and Migrations](#database-and-migrations)
7. [Application Architecture](#application-architecture)
8. [Middleware](#middleware)
9. [Error Handling](#error-handling)
10. [Logging and Request Context](#logging-and-request-context)
11. [API Documentation with Swagger](#api-documentation-with-swagger)
12. [Request Validation and DTOs](#request-validation-and-dtos)
13. [File Upload and Storage](#file-upload-and-storage)
14. [Global Pagination](#global-pagination)
15. [Email Module](#email-module)
16. [Health Check](#health-check)
17. [Important Commands](#important-commands)

---

# 1. Tech Stack

| Technology              | Purpose                            |
| ----------------------- | ---------------------------------- |
| Node.js 22              | JavaScript runtime                 |
| TypeScript              | Static typing                      |
| Express 5               | HTTP framework                     |
| PostgreSQL 17           | Relational database                |
| TypeORM                 | ORM and database migrations        |
| Docker & Docker Compose | Containerization                   |
| Zod                     | Runtime validation and DTO schemas |
| Pino                    | Structured application logging     |
| pino-http               | HTTP request logging               |
| Multer                  | Multipart file uploads             |
| Swagger / OpenAPI       | API documentation                  |
| express-rate-limit      | Request rate limiting              |
| redis                   | Caching                            |

---

# 2. Project Structure

The application follows a modular architecture.

```text
project/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cors.config.ts
│   │   │   ├── compression.config.ts
│   │   │   ├── logger.config.ts
│   │   │   ├── rateLimiter.config.ts
│   │   │   ├── swagger.config.ts
│   │   │   ├── storage.config.ts
│   │   │   └── upload.config.ts
│   │   │
│   │   ├── global/
│   │   │   ├── dto/
│   │   │   │   ├── pagination-query.dto.ts
│   │   │   │   ├── pagination-meta.dto.ts
│   │   │   │   └── paginated-response.dto.ts
│   │   │   │
│   │   │   ├── errors/
│   │   │   │   ├── customError.error.ts
│   │   │   │   ├── badRequest.error.ts
│   │   │   │   ├── unauthorized.error.ts
│   │   │   │   ├── forbidden.error.ts
│   │   │   │   ├── notFound.error.ts
│   │   │   │   ├── conflict.error.ts
│   │   │   │   └── internalServer.error.ts
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── error.handler.ts
│   │   │   │   ├── requestContext.middleware.ts
│   │   │   │   └── validateBody.middleware.ts
│   │   │   │
│   │   │   ├── storage/
│   │   │   │   └── storage.service.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   └── pagination.util.ts
│   │   │   │
│   │   │   └── types/
│   │   │
│   │   ├── modules/
│   │   │   ├── email/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   └── email.routes.ts
│   │   │   │
│   │   │   ├── system/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   └── system.routes.ts
│   │   │   │
│   │   │   └── storage/
│   │   │       ├── controllers/
│   │   │       └── storage.routes.ts
│   │   │
│   │   ├── migrations/
│   │   │
│   │   ├── app.ts
│   │   └── main.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── compose.yaml
├── docker.dev
├── docker.prod
├── .env.dev
├── .env.prod
└── README.md
```

**Architecture principles:**

- `config/`: Application configuration.
- `global/`: Reusable components shared across modules.
- `modules/`: Feature-based application modules.
- `migrations/`: Database schema migrations.
- `app.ts`: Express application configuration.
- `main.ts`: Application startup and process lifecycle.

Controllers handle HTTP requests, services contain business logic, and repositories handle database operations.

---

# 3. Requirements

Install the following:

- Docker Desktop or Docker Engine.
- Docker Compose.
- Node.js 22 (for local development outside Docker).
- npm.

Check your installations:

```bash
node --version
npm --version
docker --version
docker compose version
```

---

# 4. Environment Configuration

The project uses separate environment files for development and production.

```text
.env.dev
.env.prod
```

Typical configuration includes:

```env
NODE_ENV=development
PORT=3000

APP_BASE_URL=http://localhost:3000

STORAGE_DRIVER=local
```

Database configuration must match the PostgreSQL service configured in Docker Compose and the TypeORM data source.

Make sure the database name configured by the application matches `POSTGRES_DB`.

Never commit environment files containing real credentials or secrets.

---

# 5. Running the Application

## Development

From the project root:

```bash
docker compose --env-file .env.dev up -d --build --force-recreate
```

This command:

- Loads `.env.dev`.
- Builds the application image.
- Recreates the containers.
- Starts the containers in detached mode.

Check running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

View only the API logs:

```bash
docker compose logs -f express-api
```

Stop containers:

```bash
docker compose --env-file .env.dev down
```

Rebuild the API container:

```bash
docker compose --env-file .env.dev up -d --build --force-recreate express-api
```

## API URL

```text
http://localhost:3000
```

Health endpoint:

```http
GET /api/system/health
```

---

# 6. Database and Migrations

The project uses PostgreSQL and TypeORM.

Database schema changes should be managed through migrations rather than relying on automatic schema synchronization in production.

## Generate a migration

After modifying your entities:

Run from the `server/` directory:

```bash
npm run typeorm -- migration:generate src/migrations/init
```

The generated migration contains the SQL changes detected by TypeORM.

Review the generated migration before executing it.

## Run migrations

```bash
npm run migration:run
```

This applies pending migrations to the configured database.

## Important migration workflow

Whenever you modify an entity:

1. Modify the entity.
2. Generate a migration.
3. Review the generated migration.
4. Run the migration.
5. Verify the database structure.

**Critical commands:**

```bash
npm run typeorm -- migration:generate src/migrations/init

npm run migration:run
```

The TypeORM CLI must use the same database configuration as the application.

Do not delete your PostgreSQL Docker volume to resolve ordinary migration or connection problems. Existing volumes preserve database data.

---

# 7. Application Architecture

The Express application and the server startup are separated.

## app.ts

Responsible for configuring Express:

```typescript
const app = express();

app.use(requestContext);
app.use(compressionMiddleware);
app.use(corsMiddleware);
app.use(express.json());

app.use("/uploads", express.static(uploadDirectory));

app.use(globalRateLimiter);

app.use("/api/system", systemRouter);
app.use("/api/email", emailRouter);

app.use(errorHandler);

export default app;
```

## main.ts

Responsible for:

- Starting the HTTP server.
- Handling process-level failures.
- Handling SIGTERM and SIGINT.
- Gracefully shutting down the server.

Controllers and routers should be instantiated and mounted through their respective modules.

### Dependency injection

Use constructor injection for services:

```typescript
export default class EmailController {
  constructor(private readonly emailService: EmailService) {}

  sendTestEmail = async (req: Request, res: Response) => {
    const result = await this.emailService.sendTestEmail({
      to: req.body.to,
    });

    return res.json({
      success: true,
      result,
    });
  };
}
```

Instantiate the service and controller once when defining the router:

```typescript
const emailService = new EmailService();
const emailController = new EmailController(emailService);

router.post("/test", emailController.sendTestEmail);
```

This avoids creating a new controller and service for every request.

---

# 8. Middleware

The middleware order is important.

Recommended application order:

1. Request context.
2. Compression.
3. CORS.
4. JSON body parser.
5. Static file serving.
6. Swagger documentation (development only).
7. Global rate limiter.
8. Application routers.
9. Global error handler.

The error handler must be registered after all routers.

### Global rate limiter

The application uses `express-rate-limit` to control incoming requests and protect the API from excessive traffic.

### Compression

Compression middleware reduces the response payload size.

### CORS

CORS configuration controls which origins are allowed to access the API.

### Request context

Request context tracks information such as:

- Request ID.
- Request start time.
- Request duration.
- HTTP method.
- Request path.

This information is reused by the global error handler and logger.

---

# 9. Error Handling

The application uses a centralized error-handling system.

Instead of manually returning error responses from every controller, throw custom errors and let the global error handler format the response.

## CustomError

All application errors extend a common base class:

```typescript
export default class CustomError<TCode extends string = string> extends Error {
  public readonly statusCode: number;
  public readonly code: TCode;

  constructor(options: { message: string; statusCode: number; code: TCode }) {
    super(options.message);

    this.name = this.constructor.name;
    this.statusCode = options.statusCode;
    this.code = options.code;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
```

Example:

```typescript
export default class ConflictError extends CustomError<"CONFLICT"> {
  constructor(message = "Resource conflict") {
    super({
      message,
      statusCode: 409,
      code: "CONFLICT",
    });
  }
}
```

Available error types should cover common HTTP errors:

| Error                 | Status |
| --------------------- | -----: |
| BadRequestError       |    400 |
| UnauthorizedError     |    401 |
| ForbiddenError        |    403 |
| NotFoundError         |    404 |
| MethodNotAllowedError |    405 |
| NotAcceptableError    |    406 |
| ConflictError         |    409 |
| TooManyRequestsError  |    429 |
| InternalServerError   |    500 |

## Using custom errors

Inside a service:

```typescript
if (!user) {
  throw new NotFoundError("User not found");
}
```

Inside a controller:

```typescript
if (!req.body.email) {
  throw new BadRequestError("Email is required");
}
```

## Express 5 automatic error forwarding

The project uses Express 5.

Rejected promises from asynchronous route handlers are automatically forwarded to the global error handler.

You do not need to wrap every controller in try/catch.

Example:

```typescript
getUser = async (req: Request, res: Response) => {
  const user = await this.userService.getUser(req.params.id);

  return res.json({
    success: true,
    user,
  });
};
```

If `getUser()` throws a `NotFoundError`, Express 5 forwards it to `errorHandler`.

## Database errors

Database errors should be translated into meaningful application errors where appropriate.

Examples:

- Missing database resource → NotFoundError.
- Unique constraint violation → ConflictError.
- Foreign key constraint violation → ConflictError.
- Unexpected database failure → InternalServerError.

Use database-driver or ORM-specific error codes when implementing this mapping.

Do not expose raw SQL queries, database credentials, or internal database details in HTTP responses.

## Process-level errors

HTTP request errors and process-level errors are different.

- Request errors should be handled by Express.
- Background task failures should be caught by the background task.
- Uncaught exceptions and unhandled rejections outside Express require process-level handling.

For genuinely unrecoverable process errors, terminate gracefully and let Docker restart the container according to its restart policy.

Never catch an uncaught exception just to log it and continue running in an unknown state.

---

# 10. Logging and Request Context

The application uses Pino for structured logging.

Logs should provide useful context when investigating errors.

Recommended information:

- Timestamp.
- Request ID.
- HTTP method.
- Request path.
- Matched route.
- Response duration.
- IP address.
- User agent.
- Environment.
- Error name.
- Error message.
- Error code.
- Stack trace.

Example:

```typescript
logger.error(
  {
    requestId,
    method: req.method,
    path: req.path,
    durationMs,
    err: error,
  },
  "Unhandled application error",
);
```

Use:

- `logger.info()` for normal application events.
- `logger.warn()` for recoverable or expected warnings.
- `logger.error()` for unexpected application failures.

Avoid logging passwords, authentication tokens, and other sensitive information.

---

# 11. API Documentation with Swagger

Swagger UI is available in development.

```text
http://localhost:3000/api-docs
```

Document endpoints using OpenAPI annotations.

Example:

```typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get("/", controller.getUsers);
```

Use reusable schemas under:

```yaml
components:
  schemas:
```

This is particularly useful for shared DTOs, pagination, and response structures.

Keep Swagger documentation synchronized with actual validation rules and API responses.

---

# 12. Request Validation and DTOs

The project uses Zod for runtime request validation and TypeScript type inference.

DTO files should live inside their respective modules:

```text
modules/
└── users/
    └── dto/
        ├── create-user.dto.ts
        ├── update-user.dto.ts
        └── get-users.dto.ts
```

## Example DTO

```typescript
import { z } from "zod";

export const CreateUserDtoSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
```

## validateBody middleware

Use the validation middleware in routes:

```typescript
router.post("/", validateBody(CreateUserDtoSchema), controller.createUser);
```

The middleware:

1. Receives the request body.
2. Validates it with Zod.
3. Replaces `req.body` with parsed data.
4. Forwards validation errors to the global error handler.

## Example destructive operation DTOs

```typescript
export const ConfirmDtoSchema = z
  .object({
    confirm: z.literal(true),
  })
  .strict();

export const DropTablesDtoSchema = z
  .object({
    tables: z
      .array(z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/))
      .min(1)
      .max(50),
    confirm: z.literal(true),
  })
  .strict();
```

Always validate user input, especially when implementing destructive database operations.

---

# 13. File Upload and Storage

The application uses Multer for receiving multipart files and a centralized `StorageService` for managing stored files.

The storage implementation is centralized rather than spread across multiple provider classes.

## Storage configuration

```env
STORAGE_DRIVER=local
APP_BASE_URL=http://localhost:3000
```

The storage configuration supports:

- `local`: Local filesystem storage.
- `external`: Reserved for a future external storage implementation.

The current implementation uses local storage.

## Storage structure

```text
global/
└── storage/
    └── storage.service.ts

config/
├── storage.config.ts
└── upload.config.ts

modules/
└── storage/
    ├── storage.controller.ts
    └── storage.routes.ts
```

## Multer configuration

**Important:** Use `memoryStorage()` because the `StorageService` is responsible for writing the files.

```typescript
const storage = multer.memoryStorage();

return multer({
  storage,
  limits: {
    fileSize: config.fileSize * 1024 * 1024,
    files: config.files,
  },
});
```

With memory storage, uploaded files contain:

```typescript
file.buffer;
```

Do not use `diskStorage()` with a service that expects `file.buffer`.

## Upload validation

The upload middleware supports:

- Maximum file size.
- Maximum file count.
- Allowed MIME types.
- Custom upload configurations.

Example document configuration:

```typescript
const documentUpload = uploadMiddleware({
  fileSize: 30,
  files: 50,
  allowedTypes: [
    UPLOAD_TYPES.PDF,
    UPLOAD_TYPES.DOC,
    UPLOAD_TYPES.DOCX,
    UPLOAD_TYPES.TXT,
  ],
});
```

Example image configuration:

```typescript
const imageUpload = uploadMiddleware({
  fileSize: 5,
  files: 1,
  allowedTypes: ALLOWED_IMAGE_TYPES,
});
```

Remember that memory storage consumes RAM. Large simultaneous uploads require appropriate limits and capacity planning.

MIME type checks should be supplemented with actual file-content validation for security-sensitive uploads.

## Upload routes

```typescript
router.post(
  "/upload/image",
  imageUpload.single("image"),
  controller.uploadImage,
);

router.post(
  "/upload/documents",
  documentUpload.array("documents", 50),
  controller.uploadDocuments,
);
```

## StorageService responsibilities

The service should own all storage operations:

- Upload files.
- Fetch a file.
- Fetch multiple files.
- List stored files.
- Delete files.

Controllers should never directly use `fs.writeFile`, `fs.readdir`, or `fs.unlink` to manage storage.

Files are served through:

```text
/uploads/<filename>
```

The storage service should validate paths and prevent path traversal.

---

# 14. Global Pagination

The application provides reusable pagination DTOs and utilities.

The purpose is to standardize pagination across all modules.

## Global pagination structure

```text
global/
├── dto/
│   ├── pagination-query.dto.ts
│   ├── pagination-meta.dto.ts
│   └── paginated-response.dto.ts
│
└── utils/
    └── pagination.util.ts
```

## Pagination query DTO

```typescript
import { z } from "zod";

export const PaginationQueryDtoSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().min(1).max(100).optional(),

  sortBy: z.string().optional(),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationQueryDto = z.infer<typeof PaginationQueryDtoSchema>;
```

Example:

```http
GET /api/users?page=2&limit=20&search=feres&sortBy=createdAt&sortOrder=desc
```

## Pagination metadata

```typescript
export interface PaginationMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

## Dynamic response DTO

Instead of wrapping everything inside a generic `data` property, the response uses the resource name.

```typescript
export type PaginatedResponseDto<K extends string, T> = {
  success: true;
  pagination: PaginationMetaDto;
} & {
  [P in K]: T[];
};
```

Example:

```typescript
type UsersResponse = PaginatedResponseDto<"users", User>;

type ProductsResponse = PaginatedResponseDto<"products", Product>;
```

## Pagination utility

```typescript
export function buildPaginationMeta({
  page,
  limit,
  total,
}: {
  page: number;
  limit: number;
  total: number;
}): PaginationMetaDto {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function getPaginationOffset(page: number, limit: number) {
  return (page - 1) * limit;
}
```

The `createPaginatedResponse()` utility dynamically assigns the resource property:

```typescript
createPaginatedResponse("users", users, pagination);
```

## Example response

```json
{
  "success": true,
  "users": [
    {
      "id": "uuid-1",
      "name": "Feres",
      "email": "feres@example.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 125,
    "totalPages": 13,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

The same global pagination system can be used for:

- Users.
- Products.
- Services.
- Posts.
- Notifications.
- Reviews.

Resource-specific filters should be added to module-specific query DTOs rather than forcing every module to use identical filters.

Always whitelist sortable database columns. Never pass an arbitrary client-provided `sortBy` value directly into SQL.

---

# 15. Email Module

The email module follows the same modular architecture.

```text
modules/
└── email/
    ├── controllers/
    │   └── email.controller.ts
    ├── services/
    │   └── email.service.ts
    └── email.routes.ts
```

The `EmailService` handles email transport and sending logic.

The `EmailController` handles HTTP requests.

Example:

```typescript
export default class EmailController {
  constructor(private readonly emailService: EmailService) {}

  sendTestEmail = async (req: Request, res: Response) => {
    const result = await this.emailService.sendTestEmail({
      to: req.body.to,
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      result,
    });
  };
}
```

Instantiate the service and controller once when defining the routes.

Keep SMTP credentials in environment variables, never in source code.

---

# 16. Health Check

The system module should expose a health endpoint:

```http
GET /api/system/health
```

Example response:

```json
{
  "success": true,
  "message": "API is running"
}
```

The Docker health check should use this endpoint to determine whether the API container is healthy.

A basic HTTP health check confirms the application is responding. If database availability is important to readiness, add a separate database connectivity check.

---

# 17. Important Commands

This section contains the commands most frequently needed during development.

## Start / rebuild the application

```bash
docker compose --env-file .env.dev up -d --build --force-recreate
```

## Stop containers

```bash
docker compose --env-file .env.dev down
```

## View all logs

```bash
docker compose logs -f
```

## View API logs

```bash
docker compose logs -f express-api
```

## Check container status

```bash
docker compose ps
```

## Generate TypeORM migration

Run from `server/`:

```bash
npm run typeorm -- migration:generate src/migrations/init
```

## Run TypeORM migrations

```bash
npm run migration:run
```

## Check Express version

```bash
npm ls express
```

The project should use Express 5 and matching TypeScript definitions:

```bash
npm install express@5
npm install -D @types/express@5
```

## Install dependencies

Run from `server/`:

```bash
npm install
```

---

# Development Guidelines

When adding new functionality:

1. Create a module for the feature.
2. Define request DTOs using Zod.
3. Create a controller for HTTP operations.
4. Create a service for business logic.
5. Keep database access in repositories.
6. Register routes in the module router.
7. Add Swagger documentation.
8. Reuse global errors, logging, validation, and pagination.
9. Generate and run migrations when database entities change.
10. Test the feature through the API.

## Core principles

- Use Express 5 asynchronous error forwarding.
- Keep controllers focused on HTTP concerns.
- Keep business logic inside services.
- Keep database operations inside repositories.
- Use DTOs and runtime validation for incoming requests.
- Use centralized error handling.
- Never expose internal database errors to clients.
- Use the centralized StorageService for file operations.
- Use migrations to manage database schema changes.
- Reuse global pagination and response structures.
- Keep credentials and secrets in environment variables.

---

**End of README**
