import {
  ALLOWED_IMAGE_TYPES,
  uploadMiddleware,
} from "../../global/middleware/upload.middleware";
import { UPLOAD_TYPES } from "../../global/types/upload.types";

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

export default documentUpload;

export const imageUpload = uploadMiddleware({
  fileSize: 5,
  files: 1,
  allowedTypes: ALLOWED_IMAGE_TYPES,
});
