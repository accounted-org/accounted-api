export type PaginationParams = {
  page: number;
  limit: number;
};

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
