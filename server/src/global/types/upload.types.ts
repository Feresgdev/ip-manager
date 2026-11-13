export const UPLOAD_TYPES = {
  JPEG: "image/jpeg",
  PNG: "image/png",
  WEBP: "image/webp",
  GIF: "image/gif",
  SVG: "image/svg+xml",
  PDF: "application/pdf",
  TXT: "text/plain",
  DOC: "application/msword",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;
export interface UploadOptions {
  fileSize?: number; // MB per file
  files?: number; // Maximum number of files
  allowedTypes?: string[];
  destination?: string;
}
