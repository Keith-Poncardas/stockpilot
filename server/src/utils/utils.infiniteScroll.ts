// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Raw input for a cursor-based infinite scroll query.
 */
export interface CursorPaginationInput {
    /** Opaque cursor — the `id` of the last item seen by the client. Omit for the first page. */
    cursor?: string | null;
    /** Maximum number of items to fetch. Defaults to 20. Capped at 100. */
    limit?: number | null;
}

/**
 * Resolved, safe cursor-pagination params ready for use in a Prisma query.
 */
export interface CursorPaginationParams {
    take: number;
    /** The cursor value to pass to Prisma's `cursor` + `skip` options. Undefined on the first page. */
    cursor?: string;
}

/**
 * Metadata returned alongside an infinite-scroll result set.
 */
export interface InfiniteScrollMeta {
    /** `id` of the last item in this batch — pass as `cursor` to fetch the next page. */
    nextCursor: string | null;
    /** True when there are more items beyond this batch. */
    hasNextPage: boolean;
}

/**
 * A fully typed infinite-scroll response.
 */
export interface InfiniteScrollResult<T> {
    data: T[];
    meta: InfiniteScrollMeta;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolves and validates raw cursor-pagination input into safe Prisma-ready params.
 *
 * @example
 * const { take, cursor } = resolveCursorParams({ cursor: "some-uuid", limit: 20 });
 */
export function resolveCursorParams(input?: CursorPaginationInput | null): CursorPaginationParams {
    const take = Math.min(MAX_LIMIT, Math.max(1, Math.floor(input?.limit ?? DEFAULT_LIMIT)));
    const cursor = input?.cursor ?? undefined;
    return { take, cursor };
}

/**
 * Builds the infinite-scroll metadata from a fetched batch.
 *
 * Fetches `take + 1` items from the DB so it can peek at whether a next page
 * exists without a separate COUNT query. This function slices the extra item
 * off before returning.
 *
 * Pass the full `take + 1` result from Prisma here; `buildInfiniteScrollMeta`
 * will trim it and set `hasNextPage` accordingly.
 *
 * @param items  - Raw Prisma result fetched with `take + 1`.
 * @param take   - The original requested limit (NOT take + 1).
 * @returns      - `{ data, meta }` ready to return from the resolver.
 *
 * @example
 * const rawItems = await prisma.product.findMany({ take: take + 1, ... });
 * return buildInfiniteScrollResult(rawItems, take);
 */
export function buildInfiniteScrollResult<T extends { id: string }>(
    items: T[],
    take: number,
): InfiniteScrollResult<T> {
    const hasNextPage = items.length > take;
    const data = hasNextPage ? items.slice(0, take) : items;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return {
        data,
        meta: { nextCursor, hasNextPage },
    };
}

/**
 * Convenience wrapper that combines `resolveCursorParams` and `buildInfiniteScrollResult`.
 *
 * Returns a `{ params, buildResult }` pair so you can use `params` for the
 * Prisma query and call `buildResult(rawItems)` on the response.
 *
 * @example
 * const { params, buildResult } = createInfiniteScroller({ cursor, limit });
 *
 * const items = await prisma.product.findMany({
 *     take: params.take + 1,
 *     ...(params.cursor && { cursor: { id: params.cursor }, skip: 1 }),
 *     orderBy: { createdAt: 'desc' },
 * });
 *
 * return buildResult(items);
 */
export function createInfiniteScroller(input?: CursorPaginationInput | null) {
    const params = resolveCursorParams(input);

    return {
        params,
        buildResult: <T extends { id: string }>(items: T[]) =>
            buildInfiniteScrollResult(items, params.take),
    };
}
