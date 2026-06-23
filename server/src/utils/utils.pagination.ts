// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Raw pagination input — typically sourced from a GraphQL resolver or REST query.
 */
export interface PaginationInput {
    /** 1-based page number. Defaults to 1. */
    page?: number | null;
    /** Number of items per page. Defaults to 10. Capped at 100. */
    limit?: number | null;
}

/**
 * Resolved, safe pagination params ready for use.
 */
export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

/**
 * Pagination metadata returned alongside a paginated result set.
 */
export interface PaginationMeta {
    /** Current page number (1-based). */
    page: number;
    /** Items per page. */
    limit: number;
    /** Index of the first item on this page (1-based). 0 when there are no results. */
    firstItem: number;
    /** Index of the last item on this page (1-based). 0 when there are no results. */
    lastItem: number;
    /** Total number of matching records in the database. */
    totalItems: number;
    /** Total number of pages. */
    totalPages: number;
    /** Whether a previous page exists. */
    hasPreviousPage: boolean;
    /** Whether a next page exists. */
    hasNextPage: boolean;
}

/**
 * A fully paginated response wrapping a data slice and its metadata.
 */
export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolves and validates raw pagination input into safe, clamped params.
 *
 * @example
 * const { page, limit, skip } = resolvePaginationParams({ page: 3, limit: 20 });
 * // → { page: 3, limit: 20, skip: 40 }
 */
export function resolvePaginationParams(input?: PaginationInput | null): PaginationParams {
    const page  = Math.max(1, Math.floor(input?.page  ?? DEFAULT_PAGE));
    const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(input?.limit ?? DEFAULT_LIMIT)));
    const skip  = (page - 1) * limit;

    return { page, limit, skip };
}

/**
 * Builds the pagination metadata object from resolved params and a total count.
 *
 * @param params - Output of `resolvePaginationParams`.
 * @param total  - Total number of records (from a Prisma `count` call).
 *
 * @example
 * const meta = buildPaginationMeta(params, 42);
 * // { firstItem: 1, lastItem: 10, totalItems: 42, totalPages: 5, ... }
 */
export function buildPaginationMeta(
    params: PaginationParams,
    total: number,
): PaginationMeta {

    const { page, limit, skip } = params;
    const totalPages  = total === 0 ? 1 : Math.ceil(total / limit);
    const clampedPage = Math.min(page, totalPages);

    const firstItem = total === 0 ? 0 : skip + 1;
    const lastItem  = Math.min(skip + limit, total);

    return {
        page: clampedPage,
        limit,
        firstItem,
        lastItem,
        totalItems: total,
        totalPages,
        hasPreviousPage: clampedPage > 1,
        hasNextPage: clampedPage < totalPages,
    };
}

/**
 * Convenience wrapper that combines both helpers.
 * Resolves pagination params and immediately builds the metadata.
 *
 * Returns `{ params, buildMeta }` so you can use `params` for the Prisma query
 * and `meta` in the response.
 *
 * @example
 * const { params, buildMeta } = createPaginator({ page: 1, limit: 10 });
 *
 * const [data, total] = await Promise.all([
 *     prisma.product.findMany({ skip: params.skip, take: params.limit }),
 *     prisma.product.count(),
 * ]);
 *
 * return { data, meta: buildMeta(total) };
 */
export function createPaginator(input?: PaginationInput | null) {
    const params = resolvePaginationParams(input);

    return {
        params,
        buildMeta: (total: number): PaginationMeta =>
            buildPaginationMeta(params, total),
    };
}
