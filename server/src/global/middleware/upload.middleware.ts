import multer from "multer";
import { UPLOAD_TYPES, UploadOptions } from "../types/upload.types";
import { BadRequestError } from "../errors";

export const ALLOWED_FILE_TYPES = Object.values(UPLOAD_TYPES);

export const ALLOWED_IMAGE_TYPES = [
  UPLOAD_TYPES.JPEG,
  UPLOAD_TYPES.PNG,
  UPLOAD_TYPES.WEBP,
  UPLOAD_TYPES.GIF,
  UPLOAD_TYPES.SVG,
];

const DEFAULT_OPTIONS: Required<UploadOptions> = {
  fileSize: 10,
  files: 10,
  allowedTypes: ALLOWED_FILE_TYPES,
  destination: "",
};

export function uploadMiddleware(options: UploadOptions = {}) {
  const config = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return multer({
    storage: multer.memoryStorage(),

    limits: {
      fileSize: config.fileSize * 1024 * 1024,
      files: config.files,
    },

    fileFilter: (_req, file, callback) => {
      if (!config.allowedTypes.includes(file.mimetype)) {
        return callback(
          new BadRequestError(`File type '${file.mimetype}' is not allowed`),
        );
      }

      callback(null, true);
    },
  });
}

export const upload = uploadMiddleware();
