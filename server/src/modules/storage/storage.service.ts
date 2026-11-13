import { randomUUID } from "crypto";
import { mkdir, writeFile, readFile, unlink } from "fs/promises";
import path from "path";
import { storageConfig } from "../../config/storage.config";
import { readdir, stat } from "fs/promises";
import { BadRequestError } from "../../global/errors";

interface StoredFile {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
}

interface FetchedFile {
  url: string;
  buffer: Buffer;
}

export default class StorageService {
  private readonly uploadDir = path.resolve(
    process.cwd(),
    storageConfig.local.directory,
  );

  private readonly publicPath = storageConfig.local.publicPath;

  private readonly baseUrl =
    process.env.APP_BASE_URL || "http://localhost:3000";

  constructor() {
    if (storageConfig.driver === "local") {
      mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(files: Express.Multer.File[]) {
    if (!files?.length) {
      throw new BadRequestError("No files provided");
    }

    await mkdir(this.uploadDir, { recursive: true });

    return Promise.all(
      files.map(async (file) => {
        if (!file.buffer) {
          throw new BadRequestError(
            `File "${file.originalname}" has no buffer. Check Multer storage configuration.`,
          );
        }

        const extension = path.extname(file.originalname);
        const fileName = `${randomUUID()}${extension}`;
        const filePath = path.join(this.uploadDir, fileName);

        await writeFile(filePath, file.buffer);

        return {
          originalName: file.originalname,
          fileName,
          mimeType: file.mimetype,
          size: file.size,
          url: `${this.baseUrl}${this.publicPath}/${encodeURIComponent(fileName)}`,
        };
      }),
    );
  }

  private getFilePath(url: string): string {
    const parsedUrl = new URL(url);

    if (parsedUrl.origin !== new URL(this.baseUrl).origin) {
      throw new Error("Invalid storage URL");
    }

    const decodedPath = decodeURIComponent(parsedUrl.pathname);

    if (!decodedPath.startsWith(`${this.publicPath}/`)) {
      throw new Error("Invalid storage URL");
    }

    const fileName = decodedPath.slice(this.publicPath.length + 1);

    if (!fileName || path.basename(fileName) !== fileName) {
      throw new Error("Invalid storage file path");
    }

    return path.join(this.uploadDir, fileName);
  }

  async fetch(url: string): Promise<Buffer> {
    if (storageConfig.driver !== "local") {
      throw new Error("External storage is not implemented yet");
    }

    return readFile(this.getFilePath(url));
  }

  async list() {
    if (storageConfig.driver !== "local") {
      throw new Error("External storage is not implemented yet");
    }

    await mkdir(this.uploadDir, { recursive: true });

    const entries = await readdir(this.uploadDir, {
      withFileTypes: true,
    });

    return Promise.all(
      entries
        .filter((entry) => entry.isFile())
        .map(async (entry) => {
          const filePath = path.join(this.uploadDir, entry.name);
          const stats = await stat(filePath);

          return {
            filename: entry.name,
            size: stats.size,
            extension: path.extname(entry.name).toLowerCase(),
            uploadedAt: stats.birthtime.toISOString(),
            url: `${this.baseUrl}${this.publicPath}/${encodeURIComponent(entry.name)}`,
          };
        }),
    );
  }

  async fetchMany(urls: string[]): Promise<FetchedFile[]> {
    return Promise.all(
      urls.map(async (url) => ({
        url,
        buffer: await this.fetch(url),
      })),
    );
  }

  async delete(url: string): Promise<void> {
    if (storageConfig.driver !== "local") {
      throw new Error("External storage is not implemented yet");
    }

    await unlink(this.getFilePath(url));
  }
}
