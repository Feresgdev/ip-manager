import { PaginationMetaDto } from "./pagination-meta.dto";

export type PaginatedResponseDto<K extends string, T> = {
  success: true;
  pagination: PaginationMetaDto;
} & {
  [P in K]: T[];
};
