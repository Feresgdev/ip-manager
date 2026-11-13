import { Request, Response } from "express";

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotAcceptableError,
  NotFoundError,
  ServiceUnavailableError,
  TooManyRequestsError,
  UnauthorizedError,
  UnprocessableEntityError,
} from "../../global/errors";

import { TestErrorDto } from "../../global/dto/test-error.dto";
import StorageService from "../storage/storage.service";
import SystemService from "./system.service";
import { DropTablesDto } from "./system.dto";

export default class SystemController {
  constructor(
    private readonly storageService: StorageService,
    private readonly systemService: SystemService,
  ) {}
  getAppHealth = async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "API is running",
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV ?? "development",
      },
    });
  };

  testAppErrors = async (req: Request<{}, {}, TestErrorDto>, res: Response) => {
    if (process.env.NODE_ENV === "production") {
      throw new NotFoundError("Route not found");
    }

    const { type } = req.body ?? {};

    if (!type || typeof type !== "string") {
      throw new BadRequestError(
        "An error type is required in the request body",
      );
    }

    const errorFactories: Record<string, () => Error> = {
      BAD_REQUEST: () => new BadRequestError("Test bad request error"),
      UNAUTHORIZED: () => new UnauthorizedError("Test unauthorized error"),
      FORBIDDEN: () => new ForbiddenError("Test forbidden error"),
      NOT_FOUND: () => new NotFoundError("Test not found error"),
      NOT_ACCEPTABLE: () => new NotAcceptableError("Test not acceptable error"),
      CONFLICT: () => new ConflictError("Test conflict error"),

      UNPROCESSABLE_ENTITY: () =>
        new UnprocessableEntityError("Test unprocessable entity error"),

      TOO_MANY_REQUESTS: () =>
        new TooManyRequestsError("Test too many requests error"),

      INTERNAL_SERVER_ERROR: () =>
        new InternalServerError("Test internal server error"),

      SERVICE_UNAVAILABLE: () =>
        new ServiceUnavailableError("Test service unavailable error"),

      UNHANDLED: () => new Error("Test unexpected application error"),
    };

    const createError = errorFactories[type.toUpperCase()];

    if (!createError) {
      throw new BadRequestError(`Unsupported error type: ${type}`);
    }

    throw createError();
  };

  testUpload = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new BadRequestError("No files were uploaded");
    }

    const uploadedFiles = await this.storageService.upload(files);

    return res.status(201).json({
      success: true,
      message: "Files uploaded successfully",
      count: uploadedFiles.length,
      data: uploadedFiles,
    });
  };

  testUploadSingleImage = async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
      throw new BadRequestError("No image was uploaded");
    }
    const uploadedFiles = await this.storageService.upload([file]);

    const uploadedFile = uploadedFiles[0];

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: uploadedFile,
    });
  };

  testUploadMultipleFiles = async (req: Request, res: Response) => {
    const files = await this.storageService.list();

    return res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  };

  testUploadDocuments = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new BadRequestError("No documents were uploaded");
    }

    const uploadedDocuments = await this.storageService.upload(files);

    return res.status(201).json({
      success: true,
      message: "Documents uploaded successfully",
      count: uploadedDocuments.length,
      data: uploadedDocuments,
    });
  };

  clearTable = async (req: Request<{ table: string }>, res: Response) => {
    const data = await this.systemService.clearTable(req.params.table);

    return res.status(200).json({
      success: true,
      message: `Data of table "${data.table}" deleted`,
      data,
    });
  };

  dropTable = async (req: Request<{ table: string }>, res: Response) => {
    const data = await this.systemService.dropTable(req.params.table);

    return res.status(200).json({
      success: true,
      message: `Table "${data.table}" dropped`,
      data,
    });
  };

  dropTables = async (req: Request<{}, {}, DropTablesDto>, res: Response) => {
    const data = await this.systemService.dropTables(req.body.tables);

    return res.status(200).json({
      success: true,
      message: "Tables dropped",
      count: data.tables.length,
      data,
    });
  };
}
