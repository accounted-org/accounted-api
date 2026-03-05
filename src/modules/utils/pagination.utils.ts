import { PaginatedResponse, PaginationParams, PaginationQuery } from '../../@types';

export class PaginationUtils {
  static normalize(params: PaginationQuery): PaginationParams {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    return {
      page: page > 0 ? page : 1,
      limit: limit > 0 ? limit : 10,
    };
  }

  static buildResponse<T>(
    data: T[],
    total: number,
    params: PaginationParams,
  ): PaginatedResponse<T> {
    const { page, limit } = params;

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
