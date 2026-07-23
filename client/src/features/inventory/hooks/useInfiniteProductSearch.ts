import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { SEARCH_INVENTORY_PRODUCTS } from "../operations";

export interface ProductSearchItem {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    unitPrice: number;
    costPrice: number | null;
    status: string;
    isAddedInventory: boolean;
}

interface SearchInventoryProductsData {
    searchInventoryProducts: {
        data: ProductSearchItem[];
        meta: { nextCursor: string | null; hasNextPage: boolean };
    };
}

/**
 * Thin domain wrapper around the generic `useInfiniteScroll` hook.
 * Binds `SEARCH_INVENTORY_PRODUCTS` and the result extractor so that
 * consuming components stay free of query / shape details.
 */
export function useInfiniteProductSearch(search: string) {
    return useInfiniteScroll<SearchInventoryProductsData, ProductSearchItem>({
        query: SEARCH_INVENTORY_PRODUCTS,
        search,
        getResult: (data) => data.searchInventoryProducts,
    });
}
