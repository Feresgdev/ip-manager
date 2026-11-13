import { Router } from "express";
import SystemController from "./system.controller";
import { upload } from "../../global/middleware/upload.middleware";
import StorageService from "../storage/storage.service";
import documentUpload, { imageUpload } from "./systemFilesMiddleware";
import SystemService from "./system.service";
import SystemRepository from "./system.repository";
import { AppDataSource } from "../../config/database.config";
import { validateBody } from "../../global/middleware/validate.middleware";
import { ConfirmDtoSchema, DropTablesDtoSchema } from "./system.dto";

const router = Router();
const storageService = new StorageService();
const systemRepo = new SystemRepository(AppDataSource);
const systemService = new SystemService(systemRepo);

const systemController = new SystemController(storageService, systemService);

/**
 * @swagger
 * /api/system/health:
 *   get:
 *     summary: Check API health
 *     description: Returns the current API status, uptime and environment.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running successfully
 */

router.get("/health", systemController.getAppHealth);

if (process.env.NODE_ENV !== "production") {
  /**
   * @swagger
   * /api/system/error:
   *   post:
   *     summary: Trigger an HTTP error for testing
   *     description: Development endpoint for testing custom and unhandled errors.
   *     tags: [System]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - type
   *             properties:
   *               type:
   *                 type: string
   *                 enum:
   *                   - BAD_REQUEST
   *                   - UNAUTHORIZED
   *                   - FORBIDDEN
   *                   - NOT_FOUND
   *                   - NOT_ACCEPTABLE
   *                   - CONFLICT
   *                   - UNPROCESSABLE_ENTITY
   *                   - TOO_MANY_REQUESTS
   *                   - INTERNAL_SERVER_ERROR
   *                   - SERVICE_UNAVAILABLE
   *                   - UNHANDLED
   *     responses:
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Not found
   *       406:
   *         description: Not acceptable
   *       409:
   *         description: Conflict
   *       422:
   *         description: Unprocessable entity
   *       429:
   *         description: Too many requests
   *       500:
   *         description: Internal server error
   *       503:
   *         description: Service unavailable
   */
  router.post("/error", systemController.testAppErrors);
}

if (process.env.NODE_ENV !== "production") {
  /**
   * @swagger
   * /api/system/upload:
   *   post:
   *     summary: Upload multiple files
   *     description: Upload up to 10 files using multipart/form-data. Maximum 10 MB per file.
   *     tags: [System]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - files
   *             properties:
   *               files:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: binary
   *     responses:
   *       201:
   *         description: Files uploaded successfully
   *       400:
   *         description: No files provided
   *       500:
   *         description: Upload failed
   */
  router.post("/upload", upload.array("files"), systemController.testUpload);
}

if (process.env.NODE_ENV !== "production") {
  /**
   * @swagger
   * /api/system/upload/image:
   *   post:
   *     summary: Upload one image
   *     description: Upload a single JPEG, PNG, WebP, GIF or SVG image. Maximum 5 MB.
   *     tags: [System]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - image
   *             properties:
   *               image:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Image uploaded successfully
   *       400:
   *         description: No image provided
   *       500:
   *         description: Upload failed
   */
  router.post(
    "/upload/image",
    imageUpload.single("image"),
    systemController.testUploadSingleImage,
  );
}

if (process.env.NODE_ENV !== "production") {
  /**
   * @swagger
   * /api/system/uploads:
   *   get:
   *     summary: Get all uploaded files
   *     description: Returns metadata and public URLs for every file in the uploads directory.
   *     tags: [System]
   *     responses:
   *       200:
   *         description: List of uploaded files
   *       500:
   *         description: Internal server error
   */

  router.get("/uploads", systemController.testUploadMultipleFiles);
}

if (process.env.NODE_ENV !== "production") {
  /**
   * @swagger
   * /api/system/upload/documents:
   *   post:
   *     summary: Upload multiple documents
   *     description: Upload up to 50 documents, with a maximum size of 30 MB per file.
   *     tags: [System]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - documents
   *             properties:
   *               documents:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: binary
   *     responses:
   *       201:
   *         description: Documents uploaded successfully
   *       400:
   *         description: No documents uploaded or invalid file type
   *       413:
   *         description: File size limit exceeded
   */
  router.post(
    "/upload/documents",
    documentUpload.array("documents", 50),
    systemController.testUploadDocuments,
  );
}

if (process.env.NODE_ENV !== "production") {
  /**
   * @swagger
   * /api/system/database/tables:
   *   delete:
   *     summary: Drop multiple database tables
   *     description: Permanently removes multiple tables. Accepts between 1 and 50 table names. Requires explicit confirmation.
   *     tags: [Database]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/DropTablesDto'
   *           example:
   *             tables:
   *               - users
   *               - posts
   *             confirm: true
   *     responses:
   *       200:
   *         description: Tables dropped successfully
   *       400:
   *         description: Invalid request, invalid table name, or missing confirmation
   *       403:
   *         description: Forbidden
   *       404:
   *         description: One or more tables not found
   *       500:
   *         description: Internal server error
   */
  router.delete(
    "/database/tables",
    validateBody(DropTablesDtoSchema),
    systemController.dropTables,
  );
}
if (process.env.NODE_ENV !== "production") {
  /**
   * @swagger
   * /api/system/databse/tables/{table}/data:
   *   delete:
   *     summary: Clear all data from a table
   *     description: Deletes all records from the specified table without dropping the table itself. Requires explicit confirmation.
   *     tags: [Database]
   *     parameters:
   *       - in: path
   *         name: table
   *         required: true
   *         schema:
   *           type: string
   *         description: Name of the table to clear
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ConfirmDto'
   *     responses:
   *       200:
   *         description: Table data cleared successfully
   *       400:
   *         description: Invalid request or missing confirmation
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Table not found
   *       500:
   *         description: Internal server error
   */
  router.delete(
    "database/tables/:table/data",
    validateBody(ConfirmDtoSchema),
    systemController.clearTable,
  );
}

if (process.env.NODE_ENV !== "production") {
  /**
   * @swagger
   * /api/system/database/tables/{table}:
   *   delete:
   *     summary: Drop a database table
   *     description: Permanently removes the specified table. Requires explicit confirmation.
   *     tags: [Database]
   *     parameters:
   *       - in: path
   *         name: table
   *         required: true
   *         schema:
   *           type: string
   *         description: Name of the table to drop
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ConfirmDto'
   *     responses:
   *       200:
   *         description: Table dropped successfully
   *       400:
   *         description: Invalid request or missing confirmation
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Table not found
   *       500:
   *         description: Internal server error
   */
  router.delete(
    "database/tables/:table",
    validateBody(ConfirmDtoSchema),
    systemController.dropTable,
  );
}

export default router;
