import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SEARCH_PRODUCTS_INFINITE } from '../operations';
import type { IProduct } from '../types';

interface SearchProductsInfiniteData {
    searchProductsInfinite: {
        data: IProduct[];
        meta: { nextCursor: string | null; hasNextPage: boolean };
    };
}

const getResult = (data: SearchProductsInfiniteData) => data.searchProductsInfinite;
const buildVariables = (search: string, cursor: string | null, limit: number) => ({
    input: { search, cursor, limit },
});

export function useInfiniteProductSearch(search: string) {
    return useInfiniteScroll<SearchProductsInfiniteData, IProduct>({
        query: SEARCH_PRODUCTS_INFINITE,
        search,
        getResult,
        buildVariables,
    });
}
