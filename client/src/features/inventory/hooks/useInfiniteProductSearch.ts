import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { SEARCH_PRODUCTS_INFINITE } from "../operations";

export interface ProductSearchItem {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    unitPrice: number;
    costPrice: number | null;
    status: string;
}

interface SearchProductsInfiniteData {
    searchProductsInfinite: {
        data: ProductSearchItem[];
        meta: { nextCursor: string | null; hasNextPage: boolean };
    };
}

/**
 * Thin domain wrapper around the generic `useInfiniteScroll` hook.
 * Binds `SEARCH_PRODUCTS_INFINITE` and the result extractor so that
 * consuming components stay free of query / shape details.
 *
 * Uses the correct backend signature:
 *   searchProductsInfinite(input: SearchProductsInfiniteInput!)
 * where pagination fields are wrapped in an `input` object.
 */
export function useInfiniteProductSearch(search: string) {
    return useInfiniteScroll<SearchProductsInfiniteData, ProductSearchItem>({
        query: SEARCH_PRODUCTS_INFINITE,
        search,
        getResult: (data) => data.searchProductsInfinite,
        buildVariables: (search, cursor, limit) => ({
            input: { search, cursor, limit },
        }),
    });
}
