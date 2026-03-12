/**
 * Pagination Utility
 * ------------------------------------------------
 * Provides a reusable way to handle pagination
 * across multiple endpoints.
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export const getPagination = (page?: number, limit?: number) => {
  const pageNumber = page && page > 0 ? page : 1;
  const limitNumber = limit && limit > 0 ? limit : 10;

  const skip = (pageNumber - 1) * limitNumber;

  return {
    skip,
    take: limitNumber,
    page: pageNumber,
    limit: limitNumber,
  };
};
