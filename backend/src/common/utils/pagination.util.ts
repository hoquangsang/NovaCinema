export const PaginationUtil = {
  get: (page = 1, limit = 10) => ({
    skip: (page - 1) * limit,
    limit,
  }),
};