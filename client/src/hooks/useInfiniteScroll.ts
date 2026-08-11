import { useCallback, useEffect, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client";
import type { DocumentNode } from "@apollo/client";

// ─── Shared shape every cursor-paginated query must return ───────────────────

export interface InfiniteScrollPage<TItem> {
    data: TItem[];
    meta: {
        nextCursor: string | null;
        hasNextPage: boolean;
    };
}

// ─── Hook options ─────────────────────────────────────────────────────────────

export interface UseInfiniteScrollOptions<TData, TItem> {
    /**
     * A cursor-paginated GraphQL query that accepts at minimum:
     *   $search: String, $cursor: String, $limit: Int
     *
     * Or a query that wraps these in an `input` or `args` object —
     * use `buildVariables` to control the variable structure.
     */
    query: DocumentNode;

    /** Debounced search string. Changing it resets to the first page. */
    search: string;

    /**
     * Extracts the paginated payload from the raw Apollo response data.
     * @example  (data) => data.searchInventoryProducts
     */
    getResult: (data: TData) => InfiniteScrollPage<TItem>;

    /** Number of items to fetch per page. Defaults to 20. */
    pageSize?: number;

    /**
     * Additional variables merged into every query call alongside the standard
     * { search, cursor, limit } set. Useful when a query requires extra filters.
     */
    extraVariables?: Record<string, unknown>;

    /**
     * Optional: override how variables are built for each query call.
     * Use this when the GraphQL query wraps cursor-pagination fields in an
     * `input` or `args` object instead of accepting them as flat top-level variables.
     *
     * @param search - The current search string
     * @param cursor - The current cursor (null for the first page)
     * @param limit  - The page size
     * @returns The variables object to pass to Apollo
     *
     * @example
     *   // For: searchProductsInfinite(input: SearchProductsInfiniteInput!)
     *   buildVariables: (search, cursor, limit) => ({ input: { search, cursor, limit } })
     *
     * @example
     *   // For: searchCustomers(args: SearchCustomersInput!)
     *   buildVariables: (search, cursor, limit) => ({ args: { search, cursor, limit } })
     */
    buildVariables?: (
        search: string,
        cursor: string | null,
        limit: number
    ) => Record<string, unknown>;
}

// ─── Return type ──────────────────────────────────────────────────────────────

export interface UseInfiniteScrollResult<TItem> {
    items: TItem[];
    /** True while the first page is loading (or a search reset is in flight). */
    loading: boolean;
    /** True while a subsequent page is being fetched. */
    isFetchingMore: boolean;
    hasNextPage: boolean;
    loadMore: () => void;
}

/**
 * Generic cursor-based infinite scroll hook backed by Apollo Client.
 *
 * ### Memory strategy
 * - Items are accumulated in a plain JS array — cheap (~1 KB per 20 items).
 * - A `requestId` ref discards responses from superseded (stale) network calls,
 *   preventing races when the debounced search term changes quickly.
 * - Pair with `@tanstack/react-virtual` in the consuming component so only
 *   visible rows are ever mounted in the DOM.
 *
 * ### Usage (flat variables)
 * ```tsx
 * const { items, loading, isFetchingMore, hasNextPage, loadMore } =
 *     useInfiniteScroll({
 *         query: MY_PAGINATED_QUERY,
 *         search: debouncedSearch,
 *         getResult: (data) => data.myQueryField,
 *     });
 * ```
 *
 * ### Usage (wrapped input/args)
 * ```tsx
 * const { items, loading, hasNextPage, loadMore } =
 *     useInfiniteScroll({
 *         query: SEARCH_PRODUCTS_INFINITE,
 *         search: debouncedSearch,
 *         getResult: (data) => data.searchProductsInfinite,
 *         buildVariables: (search, cursor, limit) => ({ input: { search, cursor, limit } }),
 *     });
 * ```
 */
export function useInfiniteScroll<TData, TItem>({
    query,
    search,
    getResult,
    pageSize = 20,
    extraVariables,
    buildVariables,
}: UseInfiniteScrollOptions<TData, TItem>): UseInfiniteScrollResult<TItem> {
    const client = useApolloClient();

    const [items, setItems]                     = useState<TItem[]>([]);
    const [nextCursor, setNextCursor]           = useState<string | null>(null);
    const [hasNextPage, setHasNextPage]         = useState(false);
    const [loading, setLoading]                 = useState(false);
    const [isFetchingMore, setIsFetchingMore]   = useState(false);

    /** Incremented on every search reset; stale responses check against this. */
    const requestIdRef = useRef(0);

    /** Builds the variables for a given cursor. */
    const makeVariables = useCallback(
        (cursor: string | null) => {
            if (buildVariables) {
                return buildVariables(search ?? "", cursor, pageSize);
            }
            return { ...extraVariables, search: search ?? "", cursor, limit: pageSize };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search, pageSize, buildVariables]
    );

    // ─── Initial fetch / search reset ─────────────────────────────────────────
    useEffect(() => {
        const requestId = ++requestIdRef.current;

        setLoading(true);
        setItems([]);
        setNextCursor(null);
        setHasNextPage(false);

        client
            .query<TData>({
                query,
                variables: makeVariables(null),
                fetchPolicy: "network-only",
            })
            .then(({ data }) => {
                if (requestId !== requestIdRef.current) return; // stale — discard
                const page = getResult(data);
                setItems(page.data);
                setNextCursor(page.meta.nextCursor ?? null);
                setHasNextPage(page.meta.hasNextPage);
            })
            .catch((err) => {
                if (requestId !== requestIdRef.current) return;
                console.error("[useInfiniteScroll] initial fetch failed:", err);
            })
            .finally(() => {
                if (requestId === requestIdRef.current) setLoading(false);
            });
        // NOTE: extraVariables and buildVariables are intentionally excluded from deps.
        // Callers should memoize them or pass stable references to avoid re-fetches.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, query, pageSize, client, makeVariables]);

    // ─── Load next page ───────────────────────────────────────────────────────
    const loadMore = useCallback(async () => {
        if (!hasNextPage || isFetchingMore || !nextCursor) return;

        setIsFetchingMore(true);
        try {
            const { data } = await client.query<TData>({
                query,
                variables: makeVariables(nextCursor),
                fetchPolicy: "network-only",
            });

            const page = getResult(data);
            setItems((prev) => [...prev, ...page.data]);
            setNextCursor(page.meta.nextCursor ?? null);
            setHasNextPage(page.meta.hasNextPage);
        } catch (err) {
            console.error("[useInfiniteScroll] loadMore failed:", err);
        } finally {
            setIsFetchingMore(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasNextPage, isFetchingMore, nextCursor, client, query, makeVariables]);

    return { items, loading, isFetchingMore, hasNextPage, loadMore };
}
