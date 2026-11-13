import { PaginationMetaDto } from "../dto/pagination-meta.dto";
import { PaginatedResponseDto } from "../dto/paginated-response.dto";

interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export function buildPaginationMeta({
  page,
  limit,
  total,
}: PaginationOptions): PaginationMetaDto {
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

export function createPaginatedResponse<K extends string, T>(
  resource: K,
  items: T[],
  pagination: PaginationMetaDto,
): PaginatedResponseDto<K, T> {
  return {
    success: true,
    [resource]: items,
    pagination,
  } as PaginatedResponseDto<K, T>;
}

export function getPaginationOffset(page: number, limit: number) {
  return (page - 1) * limit;
}
